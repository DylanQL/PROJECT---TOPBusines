import { GetFavoritesUseCase } from '../../src/application/use-cases/GetFavoritesUseCase';
import { IFavoriteRepository } from '../../src/domain/repositories/IFavoriteRepository';
import { FavoriteCharacter, PaginatedResponse } from '../../src/domain/entities/Character';

describe('GetFavoritesUseCase', () => {
  let useCase: GetFavoritesUseCase;
  let mockRepository: jest.Mocked<IFavoriteRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new GetFavoritesUseCase(mockRepository);
  });

  describe('execute', () => {
    const mockFavorites: FavoriteCharacter[] = [
      {
        id: 1,
        swapi_id: 1,
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        created_at: new Date(),
      },
    ];

    const mockResponse: PaginatedResponse<FavoriteCharacter> = {
      data: mockFavorites,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    };

    it('debe retornar favoritos paginados con parámetros válidos', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute(1, 10);

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
      expect(result).toEqual(mockResponse);
    });

    it('debe usar valores por defecto cuando no se proporcionan parámetros', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue(mockResponse);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
      expect(result).toEqual(mockResponse);
    });

    it('debe lanzar error cuando el número de página es menor a 1', async () => {
      // Act & Assert
      await expect(useCase.execute(0, 10)).rejects.toThrow(
        'El número de página debe ser mayor o igual a 1'
      );

      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });

    it('debe lanzar error cuando el tamaño de página es menor a 1', async () => {
      // Act & Assert
      await expect(useCase.execute(1, 0)).rejects.toThrow(
        'El tamaño de página debe estar entre 1 y 100'
      );

      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });

    it('debe lanzar error cuando el tamaño de página excede 100', async () => {
      // Act & Assert
      await expect(useCase.execute(1, 101)).rejects.toThrow(
        'El tamaño de página debe estar entre 1 y 100'
      );

      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });
  });
});
