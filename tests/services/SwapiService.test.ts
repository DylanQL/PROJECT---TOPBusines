import { SwapiService } from '../../src/infrastructure/services/SwapiService';
import axios from 'axios';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SwapiService', () => {
  let service: SwapiService;

  beforeEach(() => {
    service = new SwapiService('https://swapi.py4e.com/api');
    
    // Mock del cliente axios
    mockedAxios.create = jest.fn().returnValue({
      get: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPeople', () => {
    it('debe retornar personajes transformados correctamente', async () => {
      // Arrange
      const mockResponse = {
        data: {
          count: 87,
          next: 'https://swapi.py4e.com/api/people/?page=2',
          previous: null,
          results: [
            {
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              hair_color: 'blond',
              skin_color: 'fair',
              eye_color: 'blue',
              birth_year: '19BBY',
              gender: 'male',
              homeworld: 'https://swapi.py4e.com/api/planets/1/',
              films: [],
              species: [],
              vehicles: [],
              starships: [],
              created: '2014-12-09T13:50:51.644000Z',
              edited: '2014-12-20T21:17:56.891000Z',
              url: 'https://swapi.py4e.com/api/people/1/',
            },
          ],
        },
      };

      const mockClient = {
        get: jest.fn().mockResolvedValue(mockResponse),
      };

      (service as any).client = mockClient;

      // Act
      const result = await service.getPeople();

      // Assert
      expect(mockClient.get).toHaveBeenCalledWith('/people/');
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toEqual({
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
      });
    });
  });

  describe('getPersonById', () => {
    it('debe retornar un personaje transformado por ID', async () => {
      // Arrange
      const mockResponse = {
        data: {
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'blue',
          birth_year: '19BBY',
          gender: 'male',
          homeworld: 'https://swapi.py4e.com/api/planets/1/',
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: '2014-12-09T13:50:51.644000Z',
          edited: '2014-12-20T21:17:56.891000Z',
          url: 'https://swapi.py4e.com/api/people/1/',
        },
      };

      const mockClient = {
        get: jest.fn().mockResolvedValue(mockResponse),
      };

      (service as any).client = mockClient;

      // Act
      const result = await service.getPersonById(1);

      // Assert
      expect(mockClient.get).toHaveBeenCalledWith('/people/1/');
      expect(result).toEqual({
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
      });
    });
  });
});
