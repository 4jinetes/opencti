import {
  addOpinion,
  findAll,
  findById,
  opinionsDistributionByEntity,
  opinionsNumber,
  opinionsNumberByEntity,
  opinionsTimeSeries,
  opinionsTimeSeriesByAuthor,
  opinionsTimeSeriesByEntity,
  opinionContainsStixObjectOrStixRelationship,
} from '../domain/opinion';
import {
  stixDomainObjectAddRelation,
  stixDomainObjectCleanContext,
  stixDomainObjectDelete,
  stixDomainObjectDeleteRelation,
  stixDomainObjectEditContext,
  stixDomainObjectEditField,
} from '../domain/stixDomainObject';
import {
  RELATION_CREATED_BY,
  RELATION_OBJECT,
  RELATION_OBJECT_LABEL,
  RELATION_OBJECT_MARKING,
} from '../schema/stixMetaRelationship';
import { REL_INDEX_PREFIX } from '../schema/general';
import { UPDATE_OPERATION_REPLACE } from '../database/utils';

const opinionResolvers = {
  Query: {
    opinion: (_, { id }, { user }) => findById(user, id),
    opinions: (_, args, { user }) => findAll(user, args),
    opinionsTimeSeries: (_, args, { user }) => {
      if (args.objectId && args.objectId.length > 0) {
        return opinionsTimeSeriesByEntity(user, args);
      }
      if (args.authorId && args.authorId.length > 0) {
        return opinionsTimeSeriesByAuthor(user, args);
      }
      return opinionsTimeSeries(user, args);
    },
    opinionsNumber: (_, args, { user }) => {
      if (args.objectId && args.objectId.length > 0) {
        return opinionsNumberByEntity(user, args);
      }
      return opinionsNumber(user, args);
    },
    opinionsDistribution: (_, args, { user }) => {
      if (args.objectId && args.objectId.length > 0) {
        return opinionsDistributionByEntity(user, args);
      }
      return [];
    },
    opinionContainsStixObjectOrStixRelationship: (_, args, { user }) => {
      return opinionContainsStixObjectOrStixRelationship(user, args.id, args.stixObjectOrStixRelationshipId);
    },
  },
  OpinionsOrdering: {
    createdBy: `${REL_INDEX_PREFIX}${RELATION_CREATED_BY}.name`,
  },
  OpinionsFilter: {
    createdBy: `${REL_INDEX_PREFIX}${RELATION_CREATED_BY}.internal_id`,
    markedBy: `${REL_INDEX_PREFIX}${RELATION_OBJECT_MARKING}.internal_id`,
    labelledBy: `${REL_INDEX_PREFIX}${RELATION_OBJECT_LABEL}.internal_id`,
    objectContains: `${REL_INDEX_PREFIX}${RELATION_OBJECT}.internal_id`,
  },
  Mutation: {
    opinionEdit: (_, { id }, { user }) => ({
      delete: () => stixDomainObjectDelete(user, id),
      fieldPatch: ({ input, operation = UPDATE_OPERATION_REPLACE }) =>
        stixDomainObjectEditField(user, id, input, { operation }),
      contextPatch: ({ input }) => stixDomainObjectEditContext(user, id, input),
      contextClean: () => stixDomainObjectCleanContext(user, id),
      relationAdd: ({ input }) => stixDomainObjectAddRelation(user, id, input),
      relationDelete: ({ toId, relationship_type: relationshipType }) =>
        stixDomainObjectDeleteRelation(user, id, toId, relationshipType),
    }),
    opinionAdd: (_, { input }, { user }) => addOpinion(user, input),
  },
};

export default opinionResolvers;
