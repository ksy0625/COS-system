import { Component, ElementRef, Input, Output, EventEmitter, Renderer, HostBinding } from '@angular/core';
import { Subject } from 'rxjs/Rx';



@Component({
    selector: 'custom-keyboard',
    templateUrl: 'custom-keyboard.html'
})
export class CustomKeyBoard {

    private contentString :string='';
    // Inputs
    @Input() keysTab: string[];
    @Input() colNb: number = 10;
    @Input() width: string;

    @HostBinding('class.visible') @Input() visible: boolean = true;

    // Outputs
    @Output() cKClickEmit: EventEmitter<any> = new EventEmitter();
    @Output() deleteEmit: EventEmitter<any> = new EventEmitter();

    // Component reference
    private static m_component: CustomKeyBoard = null;
    private static m_targetInput: any = null;
    private static m_targetCallback: Function = null;
    private static m_targetOrgVal: string = '';

    // Variables
    private m_main_column_nb: number;
    private m_main_cols: any;
    private m_main_rows: any;
    public zoom: number = 1;
    private rowNb: number = 1;

    // Observables for subscribers to get the events
    private static m_clickObs: any = new Subject();
    private static m_deleteObs: any = new Subject();
    private static m_showObs: any = new Subject();
    private static m_hideObs: any = new Subject();
    
    constructor(public el: ElementRef, public renderer: Renderer) {

        CustomKeyBoard.m_component = this;
    }

    ngOnInit()
    {
        // Init with the @input values
        if (this.colNb)
            this.m_main_column_nb = this.colNb;

        if (this.keysTab)
        {
            this.m_main_rows = this.range(0, (this.keysTab.length - 1), this.m_main_column_nb);
            this.m_main_cols = this.range(0, this.m_main_column_nb - 1, 1);
            this.rowNb = Math.floor((this.keysTab.length / this.m_main_column_nb + 1));
        }

        this.resize();
    }

    static get onCKClick() {
        return this.m_clickObs;
    }

    static get onDeleteClick() {
        return this.m_deleteObs;
    }

    static get onCKShow() {
        return this.m_showObs;
    }

    static get onCKHide() {
        return this.m_hideObs;
    }

    public cKClick(event, key: any)
    {
        CustomKeyBoard.onCKClick.next(key);
        this.cKClickEmit.emit(key);

        if(CustomKeyBoard.m_targetInput != null)
        {            
            if(key != "GO")
            {
                CustomKeyBoard.m_targetInput.value += key;
                this.contentString = CustomKeyBoard.m_targetInput.value;
            }
            else if(CustomKeyBoard.m_targetCallback != null)
            {
                CustomKeyBoard.m_targetCallback(CustomKeyBoard.m_targetInput.value);    
                CustomKeyBoard.hide();
            }
        }
    }

    public deleteClick(event)
    {
        CustomKeyBoard.onDeleteClick.next();
        this.deleteEmit.emit();

        if(CustomKeyBoard.m_targetInput != null)
        {
            let val:string = CustomKeyBoard.m_targetInput.value;
            if(val != null)
            {
                CustomKeyBoard.m_targetInput.value = val.slice(0, val.length -1);
                this.contentString = CustomKeyBoard.m_targetInput.value;
            }
        }
    }

    public onWindowResize(event)
    {
        this.resize();        
    }


    static setTarget(target:any, callBack:Function=()=>{})
    {
        if(this.m_targetInput != null)
            this.m_targetInput._readonly = false;

        CustomKeyBoard.m_component.contentString = target.value;
        this.m_targetOrgVal = target.value; 
        this.m_targetInput = target;
        this.m_targetCallback = callBack;
        this.m_targetInput._readonly = true;
    }

    static clearTarget()
    {
        CustomKeyBoard.m_component.contentString = '';        
        if(this.m_targetInput!=null)
        {
            this.m_targetInput._readonly = false;
            this.m_targetInput = null;
            this.m_targetCallback = null;
        }
    }


    static show(callback: Function = () => { })
    {
        if (this.m_component && !this.m_component.visible)
        {
            this.m_component.visible = true;
            setTimeout(() => {
                callback();
                CustomKeyBoard.onCKShow.next(); },
                100);
        }
    }

    static isVisible()
    {
        if (!this.m_component)
            return false;
        return this.m_component.visible;
    }

    static hide(callback: Function = () => { })
    {        
        this.clearTarget();
        if (this.m_component && this.m_component.visible)
        {
            this.m_component.visible = false;
            if (callback)
            {
                setTimeout(() => {
                    callback();
                    CustomKeyBoard.onCKHide.next(); },
                    100);
            }
        }
    }

    public hide()
    {
        let value = '';
        let bChanged:boolean = false
        if(CustomKeyBoard.m_targetInput != null)
        {
            value = CustomKeyBoard.m_targetInput.value;
            if(CustomKeyBoard.m_targetOrgVal != value)
                bChanged = true;  
        }

        // if(bChanged==true && CustomKeyBoard.m_targetCallback != null )
        //     CustomKeyBoard.m_targetCallback(value);
        
        CustomKeyBoard.hide(null);
    }

    static destroy(callback: Function = (success: boolean) => { })
    {
        if (this.m_component)
        {
            this.m_component.el.nativeElement.remove();
            this.m_component = null;
            callback(true);
        }
        else
            callback(true);
    }

    private resize()
    {
        // Compute the keyboard height (key height = 50px, toolbar height = 30px)
        let keyboardHeight = (50 * this.rowNb) + 30;
        let screenHeight = window.screen.height;

        // Make sure the keyboard is not bigger than 0.40 * screen size
        if (keyboardHeight > (screenHeight * 0.40))
            this.zoom = (screenHeight * 0.40) / keyboardHeight; 
        else
            this.zoom = 1;
    }

    private range(min, max, step)
    {
        step = step || 1;
        var tab = [];
        for (var i = min; i <= max; i += step) {
            tab.push(i);
        }
        return tab;
    }
}

