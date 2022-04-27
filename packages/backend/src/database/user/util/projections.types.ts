import { type Types } from 'mongoose';
import { UserAvailabilityDocument } from '../userAvailability.schema';

/**
 * Used to project only a users id and a single availability subdocument.
 */
export type UserAvailabilityProjectionDocument = {
  userId: Types.ObjectId;
  availabilityDocument: UserAvailabilityDocument;
};
