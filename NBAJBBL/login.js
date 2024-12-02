$(document).ready(function () {
    $("#FichaInscricao").submit(function (event) {
        var retVal = true;

        var nome = $("#Nome").val().trim();
        if (nome.length < 10 || nome.length > 100) {
            retVal = false;
            $("#NomeError").removeClass("d-none");
        } else {
            $("#NomeError").addClass("d-none");
        }

        var morada = $("#Morada").val().trim();
        if (morada.length < 20 || morada.length > 200) {
            retVal = false;
            $("#MoradaError").removeClass("d-none");
        } else {
            $("#MoradaError").addClass("d-none");
        }

        var email = $("#Email").val().trim();
        if (email.length < 10 || email.length > 100 || email.indexOf('@') > email.indexOf('.')) {
            retVal = false;
            $("#EmailError").removeClass("d-none");
        } else {
            $("#EmailError").addClass("d-none");
        }

        var local = $("input[name='local']:checked")
        if (local.length < 1) {
            retVal = false;
            $("#LocalError").removeClass("d-none");
        } else {
            $("#LocalError").addClass("d-none");
        }

        return retVal
    })



    $('#limpar').click(function () {
        $('#NomeError').addClass("d-none");
        $('#MoradaError').addClass("d-none");
        $("#EmailError").addClass("d-none");
        $("#LocalError").addClass('d-none');
    })
})

$('input[name=local]').on('click', function () {
    var total = 0;

    $('input[name=local]:checked').each(function () {
        var valor = parseFloat($(this).val());  // Converter o valor para número
        total += valor;
    });

    $("#preco").val(total);
});
