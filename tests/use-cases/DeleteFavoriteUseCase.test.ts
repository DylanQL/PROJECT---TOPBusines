import { DeleteFavoriteUseCase } from '../../src/application/use-cases/DeleteFavoriteUseCase';
import { IFavoriteRepository } from '../../src/domain/repositories/IFavoriteRepository';

describe('DeleteFavoriteUseCase', () => {
  let useCase: DeleteFavoriteUseCase;
  let mockRepository: jest.Mocked<IFavoriteRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByName: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteFavoriteUseCase(mockRepository);
  });

  describe('execute', () => {
    it('debe eliminar un personaje favorito cuando existe', async () => {
      // Arrange
      const favoriteId = 1;
      mockRepository.delete.mockResolvedValue(true);

      // Act
      await useCase.execute(favoriteId);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(favoriteId);
    });

    it('debe lanzar error cuando el personaje no existe', async () => {
      // Arrange
      const favoriteId = 999;
      mockRepository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.execute(favoriteId)).rejects.toThrow(
        `El personaje favorito con ID ${favoriteId} no existe`
      );

      expect(mockRepository.delete).toHaveBeenCalledWith(favoriteId);
    });
  });
});
