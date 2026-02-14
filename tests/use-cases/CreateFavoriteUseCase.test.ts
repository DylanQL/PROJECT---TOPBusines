import { CreateFavoriteUseCase } from '../../src/application/use-cases/CreateFavoriteUseCase';
import { IFavoriteRepository } from '../../src/domain/repositories/IFavoriteRepository';
import { ISwapiService } from '../../src/domain/services/ISwapiService';
import { Character, FavoriteCharacter } from '../../src/domain/entities/Character';

describe('CreateFavoriteUseCase', () => {
  let useCase: CreateFavoriteUseCase;
  let mockRepository: jest.Mocked<IFavoriteRepository>;
  let mockSwapiService: jest.Mocked<ISwapiService>;

  beforeEach(() => {
    // Crear mock del repositorio
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
    };

    // Crear mock del servicio SWAPI
    mockSwapiService = {
      getPersonById: jest.fn(),
      getPeople: jest.fn(),
    };

    useCase = new CreateFavoriteUseCase(mockRepository, mockSwapiService);
  });

  describe('execute', () => {
    const characterId = 1;
    
    const mockCharacterData: Character = {
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
      id: 1,
      swapi_id: characterId,
      ...mockCharacterData,
      created_at: new Date(),
    };

    it('debe crear un personaje favorito cuando no existe', async () => {
      // Arrange
      mockSwapiService.getPersonById.mockResolvedValue(mockCharacterData);
      mockRepository.exists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(mockFavoriteCharacter);

      // Act
      const result = await useCase.execute(characterId);

      // Assert
      expect(mockSwapiService.getPersonById).toHaveBeenCalledWith(characterId);
      expect(mockRepository.exists).toHaveBeenCalledWith(mockCharacterData.name);
      expect(mockRepository.create).toHaveBeenCalledWith({
        swapi_id: characterId,
        ...mockCharacterData,
      });
      expect(result).toEqual(mockFavoriteCharacter);
    });

    it('debe lanzar error cuando el personaje ya existe', async () => {
      // Arrange
      mockSwapiService.getPersonById.mockResolvedValue(mockCharacterData);
      mockRepository.exists.mockResolvedValue(true);

      // Act & Assert
      await expect(useCase.execute(characterId)).rejects.toThrow(
        `El personaje "${mockCharacterData.name}" ya existe en favoritos`
      );

      expect(mockSwapiService.getPersonById).toHaveBeenCalledWith(characterId);
      expect(mockRepository.exists).toHaveBeenCalledWith(mockCharacterData.name);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });
});
