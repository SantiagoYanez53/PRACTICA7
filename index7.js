const express = require('express');
const fs = require('fs');
const server = express();
const PORT = 3000;
function rDataBase () {
    let readDataBase = fs.readFileSync("koders.json");
        return JSON.parse(readDataBase)
};

function writeDatabase (newKoder) {
    fs.writeFileSync("koders.json",JSON.stringify(newKoder));
}

server.use(express.json());

//  nuevo koder
server.post('/koders', (req, res) => {
    const { name, age, gen, active } = req.body;
    if (!name , !age , !gen || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'Name, age, gen, and active status are required' });
    }
  
    const koders = rDataBase()
    koders.push({ name, age, gen, active });
    writeDatabase(koders);
  
    res.status(201).json({ message: 'Koder registered successfully', koder: { name, age, gen, active } });
  });

// lista de los koders
server.get('/koders', (req, res) => {
    fs.readFile('./koders.json', 'utf-8', (falla, data) => {
        if (falla) {
            return res.status(500).json({ error: 'Error al leer la base de datos' });
        }

        const koders = JSON.parse(data);
        res.json(koders);
    });
});

// eliminar un koder por nombre
server.delete('/koders/:name', (req, res) => {
    const { name } = req.params;

    fs.readFile('./koders.json', 'utf-8', (falla, data) => {
        if (falla) {
            return res.status(500).json({ error: 'Error al leer la base de datos' });
        }

        let koders = JSON.parse(data);
        const initialLength = koders.length;
        koders = koders.filter(koder => koder.name !== name);

        if (koders.length === initialLength) {
            return res.status(404).json({ error: 'Koder no encontrado' });
        }

        fs.writeFile('./koders.json', JSON.stringify(koders, null, 2), (falla) => {
            if (falla) {
                return res.status(500).json({ error: 'Error al escribir en la base de datos' });
            }
            res.json({ message: 'Koder eliminado exitosamente' });
        });
    });
});

// eliminar todo
server.delete('/koders', (req, res) => {
    fs.writeFile('./koders.json', '[]', (falla) => {
        if (falla) {
            return res.status(500).json({ error: 'Error al escribir en la base de datos' });
        }
        res.json({ message: 'Todos los koders han sido eliminados' });
    });
});

server.listen(PORT, () => {
    console.log(`Hola wacho como andamos?`);
});
