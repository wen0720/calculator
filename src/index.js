import Vue from 'vue'
import './sass/m.scss'


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
                this.final = Number(this.screenTxt.replace(/\+|-|×|÷/g, ''))  // 加總值就等於 input 的資料
            }else{
                switch ( this.method || e.target.textContent.trim() ) {
                    case '+':                    
                        this.final = Number(this.screenTxt.replace(/\+|-|×|÷/g, '')) + Number(this.final)
                        break
                    case '-':
                        this.final = Number(this.final) - Number(this.screenTxt.replace(/\+|-|×|÷/g, '')) 
                        break
                    case '×':                        
                        this.final = Number(this.final) * Number(this.screenTxt.replace(/\+|-|×|÷/g, ''))                         
                        break
                    case '÷': 
                        this.final = Number(this.final) / Number(this.screenTxt.replace(/\+|-|×|÷/g, '')) 
                        break
                }    
            }            

            this.method = e.target.textContent.trim() === '=' ? '' : e.target.textContent.trim();   // 紀錄準備計算的方式
            this.screenTxt = '0'  // 重置數字
        },
        
        output () {                                    
            this.screenTxt = this.final + '';
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
        }            
    }    
})