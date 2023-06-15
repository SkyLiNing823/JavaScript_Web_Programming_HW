"use strict"
function Ans(){
        let binary="";
        for(let i=6;i>0;i--)
        {
                if(document.getElementById(`check${i}`).checked)
                        binary+="1";
                else
                        binary+="0";
        }
        
        let n = parseInt(Number(binary),2);
        document.getElementById('ans').textContent=n;
        
}

let out='';
let mask = 1;
for(let i=0;i<6;i++,mask <<= 1)
{
        out+="<table>";
        out+=`<tr><td colspan="8">第${i+1}張卡片<input type="checkbox" id="check${i+1}"></td></tr>`;
        for(let j=0,c=0;j<64;j++)
        {
                if(j & mask){              
                if(c%8==0)out+='<tr>';
                out+='<td>'+j+'</td>';
                if((c+1)%8==0)out+='</tr>';
                c++;
                }
        }
        out+="</table>";
}
document.write(out);