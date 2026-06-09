import { AnalysisResult } from '../types/analysis';

export async function analyzeDiagramWithGemini(
  imageBase64: string,
  mimeType: string,
  fileName: string
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  // Fallback model list to ensure service availability during high demand spikes
  const defaultModel = process.env.GEMINI_MODEL;
  const models = defaultModel 
    ? [defaultModel, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'] 
    : ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  const prompt = `Anda adalah EduVision AI, sistem edukasi ahli yang berspesialisasi dalam menjelaskan diagram akademis (flowchart, UML, ERD, topologi jaringan, peta proses, grafik).
Analisis diagram yang diunggah bernama "${fileName}" dan keluarkan analisis terstruktur serta soal latihan.
Seluruh isi analisis, penjelasan, nama komponen, saran perbaikan, pertanyaan kuis, pilihan ganda, dan pembahasan kuis HARUS menggunakan Bahasa Indonesia yang baik dan benar.

JSON output yang dihasilkan harus mematuhi skema berikut:
{
  "diagramType": "Jenis diagram (misalnya: Diagram Kelas UML, Database ERD, Flowchart Proses, dll.)",
  "explanation": "Penjelasan langkah demi langkah yang jelas tentang arti diagram dan tujuan utamanya.",
  "components": ["Komponen 1 dengan deskripsi detail", "Komponen 2 dengan deskripsi detail", "..."],
  "summary": "Ringkasan singkat tingkat tinggi yang cocok untuk tinjauan cepat.",
  "improvements": ["Saran perbaikan 1", "Saran perbaikan 2", "..."],
  "questions": [
    {
      "question": "Pertanyaan 1 yang berkaitan dengan konten diagram?",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "answer": "String persis dari pilihan jawaban yang benar",
      "explanation": "Penjelasan mengapa pilihan tersebut benar."
    },
    ... (tepat 5 pertanyaan pilihan ganda)
  ]
}`;

  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Menghubungi Gemini API menggunakan model: ${modelName}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType: mimeType || 'image/png',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                diagramType: { type: 'STRING' },
                explanation: { type: 'STRING' },
                components: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                },
                summary: { type: 'STRING' },
                improvements: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                },
                questions: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      question: { type: 'STRING' },
                      options: {
                        type: 'ARRAY',
                        items: { type: 'STRING' },
                      },
                      answer: { type: 'STRING' },
                      explanation: { type: 'STRING' },
                    },
                    required: ['question', 'options', 'answer', 'explanation'],
                  },
                },
              },
              required: [
                'diagramType',
                'explanation',
                'components',
                'summary',
                'improvements',
                'questions',
              ],
            },
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API returned error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Invalid or empty response from Gemini API.');
      }

      const parsed: AnalysisResult = JSON.parse(text);
      console.log(`Sukses mendapatkan hasil analisis menggunakan model: ${modelName}`);
      return parsed;

    } catch (err: any) {
      console.warn(`Percobaan model ${modelName} gagal:`, err.message || err);
      lastError = err;
      // Lanjutkan ke model berikutnya di iterasi loop
    }
  }

  throw lastError || new Error('Semua model fallback Gemini gagal dihubungi.');
}
