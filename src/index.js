import Vue from 'vue'
import './sass/m.scss'

Vue.filter('currency', (val) => {    
    if(val.indexOf('.') === -1){
        const re = '\\d(?=(\\d{' + 3 + '})+' + '$' + ')'
        return Number(val).toFixed(Math.max(0)).replace(new RegExp(re, 'g'), '$&,')
    }else {
        return val
    }    
})

new Vue({
    el: '#calculator',
    data: {        
        number: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        txt: [0, '00', '.'],
        mark: ['÷', '×', '+', '-'],
        screenTxt: '0',   // 目前尚未加上的數字
        lastClick: '',     // 上一個打的數字
        method: '',     // 使用的計算方式，要記得上一個按的 計算方式
        temp: '',      // 儲存的編輯紀錄,
        final: 0,       // 加總數值
        hadOutput: false
    },
    computed: {
        filterCalBtn () {
            return this.txt.concat(this.number).reverse()                        
        }        
    },
    methods: {
        record(e){
            if(this.hadOutput){
                this.final = 0  
                this.screenTxt = '0'                      
                this.hadOutput = false
            }
            this.lastClick = e.target.textContent.trim();
            this.calInput(this.lastClick)
        },

        calInput (lastClick) {             
            if( this.screenTxt.length === 9 ) {
                this.screenTxt = this.screenTxt
                return
            }

            // 處理目前 input 的顯示狀態
            if( this.screenTxt === '0'){        // 如果螢幕上的是 0       
                if( lastClick !== '.' && isNaN(parseInt(lastClick)) || lastClick === '00') {   // 如果點擊[非數字（不包含.）] 或 [00]
                    this.screenTxt = this.screenTxt
                }else if(lastClick === '.'){  // 如果點擊 .
                    this.screenTxt += lastClick
                }else{
                    this.screenTxt = lastClick
                }                
            }else if( this.screenTxt.indexOf('.') > -1 ){   //如果已有 小數點
                if(lastClick === '.'){     // 且又點了一次 '.'
                    this.screenTxt = this.screenTxt 
                }else{                    
                    this.screenTxt += lastClick    
                }                
            }else{
                this.screenTxt += lastClick
            }                    
        },

        tempStore (e) { 
            if(this.hadOutput){
                this.final = 0  // 此時若 final 維持不變，在直接按運算子時，
                                // 會直接把現有的 screenTxt 拿去運算一次，所以設 0，讓他跑 if 前面的那段                                   
                this.hadOutput = false
            }

            if( e.target.textContent.trim() !== '='){
                this.lastClick = e.target.textContent.trim();
                this.calInput(this.lastClick)
            }            

            // 用 temp 紀錄目前 key 的歷史紀錄
            if(this.screenTxt !== '0'){
                this.temp += this.screenTxt                
            }                                
            
            if(Number(this.final) === 0){   // 如果目前加總為 0
                this.final = Number(this.screenTxt.replace(/\+|-|×|÷/g, ''))  // 加總值就等於 input 的資料，因為預設資料為0，
                                                                              // 一開始避免0去跟第1個數字運算
            }else{
                switch ( this.method || e.target.textContent.trim() ) {
                    case '+':                    
                        this.final = this.accPlusMinus('plus', Number(this.final), Number(this.screenTxt.replace(/\+|-|×|÷/g, '')))
                        break
                    case '-':
                        this.final = this.accPlusMinus('minus', Number(this.final), Number(this.screenTxt.replace(/\+|-|×|÷/g, ''))) 
                        break
                    case '×':                        
                        this.final = this.accMul( Number(this.final), Number(this.screenTxt.replace(/\+|-|×|÷/g, '')))                         
                        break
                    case '÷': 
                        this.final = this.accDiv( Number(this.final), Number(this.screenTxt.replace(/\+|-|×|÷/g, ''))) 
                        break
                }    
            }            

            this.method = e.target.textContent.trim() === '=' ? '' : e.target.textContent.trim();   // 紀錄準備計算的方式
            this.screenTxt = '0'  // 重置數字
        },
        
        output () {                       
            if(this.final.toString().length > 9){
                let fixedFinal = this.final.toFixed(9)
                this.screenTxt = fixedFinal + '';    
            }else{
                this.screenTxt = this.final + '';
            }             
            
            this.method = ''  ;
            this.lastClick = '';
            this.temp = ''  // 重置 temp 的資料
            this.hadOutput = true
        },

        clearAll () {
            this.screenTxt = '0'   
            this.lastClick = ''     
            this.method = ''      
            this.temp = ''      
            this.final = 0       
            this.hadOutput = false
        },

        back () {
            let tempArr = this.screenTxt.split('')
            tempArr.pop()
            this.screenTxt = tempArr.length === 0 ? '0' : tempArr.join('')            
        },
        
        accPlusMinus (type, num1, num2) {            
            let r1, r2, m;            
            try{
                r1 = num1.toString().split('.')[1].length;  // 位數
            }catch(e){
                r1 = 0
            }
            try{
                r2 = num2.toString().split('.')[1].length;  // 位數
            }catch(e){
                r2 = 0
            }                
            
            m = Math.pow(10, Math.max(r1, r2)) 

            switch (type) {
                case 'plus':
                    return Math.round(num1 * m + num2 * m) / m
                    break
                case 'minus':
                    return Math.round(num1 * m - num2 * m) / m
                    break                    
            }                                        
        },

        accMul (num1, num2) {
            let m = 0;
            let r1, r2;    

            try{
                m += num1.toString().split('.')[1].length
            }catch(e){}
            try{
                m += num2.toString().split('.')[1].length
            }catch(e){}    

            r1 = Number(num1.toString().replace('.', ''))
            r2 = Number(num2.toString().replace('.', ''))
            return r1 * r2 / Math.pow(10, m)
        },

        accDiv (num1, num2) {
            let t1, t2, r1, r2

            try{
                t1 = num1.toString().split('.')[1].length
            } catch(e){
                t1 = 0
            }
            try{
                t2 = num2.toString().split('.')[1].length
            } catch(e){
                t2 = 0
            }
            
            r1 = Number(num1.toString().replace('.', ''))
            r2 = Number(num2.toString().replace('.', ''))
            console.log(r1, r2, t1, t2)

            return this.accMul(r1/ r2 , Math.pow(10, t2 - t1))
        }
    }    
})