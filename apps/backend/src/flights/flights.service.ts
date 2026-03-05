import { Injectable, Cacheable } from '@nestjs/common';
import { Flight } from './flight.entity';
import { FlightRepository } from './flight.repository';

@Injectable()
export class FlightsService {
    constructor(private readonly flightRepository: FlightRepository) {}

    @Cacheable()
    async findAll(): Promise<Flight[]> {
        return this.flightRepository.findAll();
    }

    @Cacheable()
    async findOne(id: number): Promise<Flight> {
        return this.flightRepository.findOne(id);
    }

    // Additional methods can be added for managing flights
}