import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[error-msg]'
})
export class ErrorMsgDirective implements OnInit, OnChanges{

  // Para obtener el elemento sobre el que se trabaja
  htmlElement: ElementRef<HTMLElement>;

  // Para poder permitir que el usuario elija el color que quiera
    // Guarda el color establecido
    private _color : string = 'red';
    // Se recibe el parámetro
  @Input() set color(valor:string){
    //actualizamos el valor 
    this._color = valor;
    //Llamamos el set
    this.setColor();
  }
  
  // Para modificar el nombre de manera dinámica
    private _msg = "Este valor es obligatorio"
  @Input() set mensaje (valor: string){
    this._msg = valor;    
    this.setMensaje();
  }

  // Para modificar el nombre de manera dinámica
    private _valid = "Este valor es obligatorio"
  @Input() set valido (valor: boolean){
    if (valor === true){
      // Si es válido se debe ocultar
      this.htmlElement.nativeElement.classList.add('hidden');
    }
    else{
      this.htmlElement.nativeElement.classList.remove('hidden');
    }    
    this.setMensaje();
  }

  constructor( private element: ElementRef<HTMLElement>) { 
    // Obtenemos el elemento sobre el que se trabaja
    this.htmlElement = element;

  }

  ngOnInit(): void {
    // Queremos cambiar el color cuando se incializa el elemento
      this.setEstilo(); 
      this.setColor();
      this.setMensaje();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setEstilo();
  }

  setEstilo():void {
    this.htmlElement.nativeElement.classList.add('form-text');
  }

  setColor():void{
    // Para realizar una modificación de color
    this.htmlElement.nativeElement.style.color = this._color;
  }

  setMensaje():void{
    this.htmlElement.nativeElement.innerText = this._msg;
  }
}
