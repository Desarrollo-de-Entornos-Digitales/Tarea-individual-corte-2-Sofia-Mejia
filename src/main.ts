import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm'; // 1. Importa DataSource de TypeORM
import * as fs from 'fs';             // 2. Importa fs para leer el archivo
import * as path from 'path';         // 3. Importa path para resolver la ruta

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, 
            forbidNonWhitelisted: true, 
            transform: true, 
        }),
    );

    // --- EJECUCIÓN DE INSERT.SQL ---
    try {
        const sqlPath = path.join(__dirname, '../db/scripts/inserts.sql'); 

        if (fs.existsSync(sqlPath)) {
            console.log('⏳ Leyendo y ejecutando insert.sql...');
            const sqlScript = fs.readFileSync(sqlPath, 'utf8');
            
            const dataSource = app.get(DataSource);
            
            await dataSource.query(sqlScript);
            console.log('insert.sql ejecutado con éxito.');
        } else {
            console.warn(`No se encontró el archivo SQL en la ruta: ${sqlPath}`);
        }
    } catch (sqlError) {
        console.error('Error al ejecutar el archivo insert.sql:', sqlError);
    }
    // ---------------------------------

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
});
