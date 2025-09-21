declare module 'jspdf' {
  export interface jsPDF {
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): jsPDF;
    
    addPage(format?: number[] | string): jsPDF;
    setPage(page: number): jsPDF;
    output(type: 'blob'): Blob;
    output(type: string): string | Uint8Array;
    save(filename: string): void;
  }
  
  export interface jsPDFOptions {
    orientation?: 'portrait' | 'landscape';
    unit?: 'pt' | 'mm' | 'cm' | 'in';
    format?: string | number[];
  }
  
  export class jsPDF {
    constructor(options?: jsPDFOptions);
  }
}

declare module 'jszip' {
  export default class JSZip {
    file(name: string, data: Blob | string): void;
    generateAsync(options: { type: 'blob' }): Promise<Blob>;
  }
}