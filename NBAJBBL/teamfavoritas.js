var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/api/Teams');
    self.error = ko.observable('');
    self.records = ko.observableArray([]);

    //--- Page Events
    self.activate = function () {
        console.log('CALL: getTeams...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);

            // Retrieve existing favorites from local storage
            var favTeamsList = JSON.parse(window.localStorage.getItem('favTeams0')) || [];

            // Filter teams based on IDs and acronyms
            var teamList = data.Records.filter(function (team) {
                return favTeamsList.some(function (fav) {
                    return fav.id === team.Id && fav.acronym === team.Acronym;
                });
            });

            self.records(teamList);
            hideLoading();
        });
    };

    self.removeFavourite = function (id) {
        console.log(id);
        var a = JSON.parse(window.localStorage.getItem('favTeams0')) || [];
        console.log(a);
    
        for (var i = 0; i < a.length; i++) {
            if (a[i].id == id) {
                a.splice(i, 1);
                window.localStorage.setItem('favTeams0', JSON.stringify(a));
                self.activate();
                return; // Exit the loop after removing the item
            }
        }
    
        // If the loop completes and the item is not found, clear the localStorage
        window.localStorage.clear();
        self.activate();
    };
    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        });
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
    $("#clearFavourites").click(function () {
        if (!(JSON.parse(window.localStorage.getItem('favTeams0')) == null)) {
            window.localStorage.clear()
            window.location.reload()
        } else {
            alert("No favourites to clear")
        }
    })
});