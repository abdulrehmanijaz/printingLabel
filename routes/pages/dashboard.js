$(document).ready(function(){
    $('.loading33').show();
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/InnoventAppApi/getuserDetails",
        success: function(data)
        {
           var response =  JSON.parse(data);
           
           $('.loading33').hide();
           //console.log(response);
            if(response !== undefined 
                && response !== null && response !== ''){
                $('.username').html('<span>'+response+'</span>')
            }   
        }
    });    

    $('.loading22').show();
    $.ajax({
        type:'POST',
        url: "/api/1.0.0/InnoventAppApi/GetSerialNumber",
        success: function(data)
        {
           var response =  JSON.parse(data);
           $('.loading22').hide();
            if(response[0].last_serial_no_val !== undefined 
                && response[0].last_serial_no_val !== null && response[0].last_serial_no_val !== ''){
                $('#serialno').html('<span>'+response[0].last_serial_no_val+'</span>')
            }   
        }
    });
    var number2='';
    var alpha = '';
    $(".mcf2").on("change",function (){
          
        number2 = $(".mcf2 option:selected").attr("data_number");
        alphha =$(".mcf2 option:selected").attr("data_alpha");
        
        $("#plantref").val(alphha);

        $("#plantNo").val(number2);
        
    });
});


$('input[name="plantNo"]').keyup(function(e)
                                {
  if (/\D/g.test(this.value))
  {
    // Filter non-digits from input value.
    this.value = this.value.replace(/\D/g, '');
  }
});

$(document).on("click",'.printButton',function(){
    var error = 0;

    var $this = $('#PrinterForm');
    
     if($("#plantNo").val()=="" )
    {
        alert("Plant No Field Is Empty Please Fill !");
        error=1;
        return false;
    }

     if($("#qty").val()=="" )
    {
        alert("Qty Field Is Empty Please Fill !");
        error=1;
        return false;
    }else if($("#qty").val()<1){

        alert("Qty must be greater then 0 !");
        error=1;
        return false;

    }
    var mystyle= '<style type="text/css">@media print {footer {page-break-after: always;}}</style>';
    var newWin ='';               
    if(error == 0){
        $('.msg_div').html(`<span class="loading" >
                        <img src="../assets/images/Eclipse-1s-200px.gif" style="width:50px;display:inline-block">
                        <span style="color:red;">Preparing QR Code</span> 
                    </span>`);
         
        $.ajax({
            type:'POST',
            url: "/api/1.0.0/InnoventAppApi/PrintForm",
            data:{
                plantNo:    $("#plantNo").val(),
                qty:    $("#qty").val(),
                plantref:   $("#plantref").val(),

            },
            success: function(data)
            {
                //console.log(data);

                 $('.msg_div').html(`<span class="loading" >
                        <img src="../assets/images/Eclipse-1s-200px.gif" style="width:50px;display:inline-block">
                        <span style="color:red;">Preparing QR Code</span> 
                    </span>`);

               
           

                var response = data.split('|^***^|');
           
                
                $("#serialno span").html(response[0]);

                if(response !== '' 
                    && response !== undefined 
                    && response !== null){
                     $('.msg_div').html(``);

                    
                   
                    newWin = window.open("about:blank", "hello", "width=800,height=700");

                    newWin.document.write(mystyle+response[1]);
                    $('.msg_div').html(``);

                  
                    setTimeout(function(){
                        newWin.focus();
                        newWin.print();
                       
                    },1000);
                    

                }
                

                    
                
            }
        });
    }
})