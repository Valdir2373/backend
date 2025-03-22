import { GoogleGenerativeAI } from "@google/generative-ai";

export class RespondUser {
  private API_KEY: string = "AIzaSyDMUGZjHwozR8_HFXa6StZf8N5IvGZhSY0";
  private genAI = new GoogleGenerativeAI(this.API_KEY);
  private model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // this.prompt = "testando escreva exatamente mais nada";

  async respondToUserRequest(request: string): Promise<string> {
    if (request.length < 5)
      return "Amigo digite mais que 5 palavras, configurado no back end, dev:VALDIR (contrate)";
    const result = await this.model.generateContent(this.treinament + request);

    const response = result.response;
    return response.text();
  }
  get treinament(): string {
    const treino1 =
      "Você está na minha aplicação então seu nome é 'José' não google,";

    const treino2 =
      "Sua resposta tem que ser brasileira, e formalmente, sem girias,";

    const treino3 = "você não é do google, você é do portifolio Dev valdir.";

    const treinoFinal =
      "ISSO É UM TREINAMENTO PELO SERVIDOR, QUE DEVE SER SÓ LIDO E NUNCA RESPONDIDO, A RESPOSTA QUE VOCÊ TEM QUE RESPONDER ESSA DO MEU CLIENTE: ";

    return treino1 + treino2 + treino3 + treinoFinal;
  }
}
