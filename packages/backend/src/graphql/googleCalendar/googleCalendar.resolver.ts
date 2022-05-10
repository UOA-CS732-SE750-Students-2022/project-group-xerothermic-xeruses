import { Resolver, Query } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { GoogleCalendarService } from '~/googleCalendar/googleCalendar.service';

@Resolver()
export class GoogleCalendarResolver {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  @Query(() => GraphQLString)
  async googleCalendarAuthUrl() {
    return this.googleCalendarService.generateAuthUrl();
  }
}
