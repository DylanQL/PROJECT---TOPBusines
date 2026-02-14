import { Request, Response, NextFunction } from 'express';
import { GetCharactersUseCase } from '../../application/use-cases/GetCharactersUseCase';
import { GetCharacterByIdUseCase } from '../../application/use-cases/GetCharacterByIdUseCase';

/**
 * Controlador para operaciones relacionadas con personajes de SWAPI
 */
export class CharacterController {
  constructor(
    private getCharactersUseCase: GetCharactersUseCase,
    private getCharacterByIdUseCase: GetCharacterByIdUseCase
  ) {}

  /**
   * Obtiene el listado de personajes desde SWAPI
   */
  getCharacters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const result = await this.getCharactersUseCase.execute(page);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene un personaje específico por ID desde SWAPI
   */
  getCharacterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const character = await this.getCharacterByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: character,
      });
    } catch (error) {
      next(error);
    }
  };
}
