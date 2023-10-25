import {APIGatewayEventRequestContext} from 'aws-lambda';
import {ExaminerRole} from '../constants/ExaminerRole';

export const getExaminerRoleFromRequestContext = (requestContext: APIGatewayEventRequestContext): ExaminerRole => {
  if (requestContext.authorizer) {
    const { examinerRole } = requestContext.authorizer;

    switch (examinerRole) {
    case 'DLG': return ExaminerRole.DLG;
    case 'LDTM': return ExaminerRole.LDTM;
    default: return ExaminerRole.DE;
    }
  }
  // If role is missing we default to DE
  // We only use this for search settings not for authentication so there is no risk giving the user
  // the lowest role type.
  return ExaminerRole.DE;
};
