import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('flights')
export class FlightsController {
  @Get()
  getAllFlights() {
    // Logic to get all flights
    return [];
  }

  @Get(':id')
  getFlight(@Param('id') id: string) {
    // Logic to get flight by id
    return {};
  }

  @Post()
  createFlight(@Body() flightData: any) {
    // Logic to create a flight
    return {};
  }
}