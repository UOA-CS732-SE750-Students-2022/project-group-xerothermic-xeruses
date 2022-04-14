import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { GraphQLString } from 'graphql';
import { UserService } from '~/database/user/user.service';
import { Auth } from '~/decorators/auth.decorator';
import { User } from '~/decorators/user.decorator';
import { CalendarUtil } from '~/util/calendar.util';
import { AddUserInput } from './inputs/addUser.input';
import { UserIntervalInput } from './inputs/userInterval.input';
import { UserGraphQLModel } from './models/user.model';
import { UserAvailabilityIntervalGraphQLModel } from './models/userAvailabilityInterval.model';

@Resolver(() => UserGraphQLModel)
export class UserResolver {
  constructor(private userService: UserService, private calendarUtil: CalendarUtil) {}

  @Query(() => UserGraphQLModel)
  async getUser(@Args('id', { type: () => GraphQLString }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => [UserGraphQLModel])
  async getUsers() {
    return this.userService.findAll();
  }

  @Mutation(() => UserGraphQLModel)
  async addUser(@Args('addUserInput') addUserInput: AddUserInput) {
    return this.userService.create(addUserInput);
  }

  @Auth()
  @Query(() => GraphQLString)
  getFirebaseId(@User() user: DecodedIdToken) {
    return user.uid;
  }

  @Query(() => UserAvailabilityIntervalGraphQLModel)
  async getUserIntervals() {
    // const user = await this.userService.findOne(id);
    // if (user?.availability.length) {
    //   user.availability.forEach((availability) => {
    //     if (availability.type === 'ical') {
    //       availability.availability = this.calendarUtil.convertIcalToIntervals(
    //         availability.uri,
    //         availability.startDate,
    //         availability.endDate,
    //         availability.startHour,
    //         availability.endHour,
    //       );
    //     }
    //   });
    // }
    const intervals = this.calendarUtil.convertIcalToIntervals(
      [
        'https://uoacal.auckland.ac.nz/calendar/9929cd053ae1b4460709d83892ba6c9a54ed82462b9a57a42175e4108153db82347dc343b606f36ccfbc39461655af724244990173293d57a8d786a002fc4904',
      ],
      new Date(Date.UTC(2022, 9, 3)),
      new Date(Date.UTC(2022, 9, 6)),
      0,
      5,
    );
    return {
      intervals: intervals,
    };
  }
}
