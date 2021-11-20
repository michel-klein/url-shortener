import { config } from "../config/constants";
import { URLModel } from "../database/model/URL";
import { Request, Response } from "express";
import shortId from "shortid";

export class URLController {
    public async shorten(req: Request, response: Response): Promise<void> {
        //Verificar se a URL já existe       
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if (url) {
			response.json(url)
			return
		}
         //Criar a hash para a url
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        //Salvar a url no banco
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        //Retornar a url salva
        response.json({ originURL, hash, shortURL})
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        // Pegar o hash da url
        const { hash } = req.params
        //Encontrar a url original no DB
        const url = await URLModel.findOne({ hash })
        
        //Redirecionar para a URL original
        if (url) {
			response.redirect(url.originURL)
			return
		}
        response.status(400).json({ error: 'URL not found' })        
    }
}