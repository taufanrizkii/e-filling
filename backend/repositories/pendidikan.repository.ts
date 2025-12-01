import { pool } from "../configs/database";
import { Pendidikan, PendidikanCreateDTO } from "../models/pendidikan";

export class PendidikanRepository {
  async findAll(): Promise<Pendidikan[]> {
    const query = "SELECT * FROM pendidikan ORDER BY created_at DESC";
    const result = await pool.query(query);
    return result.rows;
  }

  //   async findById(id: number): Promise<Example | null> {
  //     const query = 'SELECT * FROM examples WHERE id = $1';
  //     const result = await pool.query(query, [id]);
  //     return result.rows[0] || null;
  //   }

  async create(data: PendidikanCreateDTO): Promise<Pendidikan> {
    const query = `
        INSERT INTO pendidikan (tahun_ajaran,semester, mata_kuliah, kelas, sks)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
    const values = [
      data.tahun_ajaran,
      data.semester,
      data.mata_kuliah,
      data.kelas,
      data.sks,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  //   async update(id: number, data: UpdateExampleDTO): Promise<Example | null> {
  //     const query = `
  //       UPDATE examples
  //       SET name = COALESCE($1, name),
  //           description = COALESCE($2, description),
  //           updated_at = CURRENT_TIMESTAMP
  //       WHERE id = $3
  //       RETURNING *
  //     `;
  //     const values = [data.name, data.description, id];
  //     const result = await pool.query(query, values);
  //     return result.rows[0] || null;
  //   }

  //   async delete(id: number): Promise<void> {
  //     const query = 'DELETE FROM examples WHERE id = $1';
  //     await pool.query(query, [id]);
  //   }
}
