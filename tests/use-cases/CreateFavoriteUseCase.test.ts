import { CreateFavoriteUseCase } from '../../src/application/use-cases/CreateFavoriteUseCase';
import { IFavoriteRepository } from '../../src/domain/repositories/IFavoriteRepository';
import { Character, FavoriteCharacter } from '../../src/domain/entities/Character';

describe('CreateFavoriteUseCase', () => {
  let useCase: CreateFavoriteUseCase;
  let mockRepository: jest.Mocked<IFavoriteRepository>;

  beforeEach(() => {
    // Crear mock del repositorio
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new CreateFavoriteUseCase(mockRepository);
  });

  describe('execute', () => {
    const mockCharacter: Character & { swapi_id: number } = {
      swapi_id: 1,
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
    };

    const mockFavoriteCharacter: FavoriteCharacter = {
      ...mockCharacter,
      id: 1,
      created_at: new Date(),
    };

    it('debe crear un personaje favorito cuando no existe', async () => {
      // Arrange
      mockRepository.exists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(mockFavoriteCharacter);

      // Act
      const result = await useCase.execute(mockCharacter);

      // Assert
      expect(mockRepository.exists).toHaveBeenCalledWith(mockCharacter.name);
      expect(mockRepository.create).toHaveBeenCalledWith(mockCharacter);
      expect(result).toEqual(mockFavoriteCharacter);
    });

    it('debe lanzar error cuando el personaje ya existe', async () => {
      // Arrange
      mockRepository.exists.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(mockCharacter)).rejects.toThrow(
        `El personaje "${mockCharacter.name}" ya existe en favoritos`
      );

      expect(mockRepository.exists).toHaveBeenCalledWith(mockCharacter.name);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });
});
