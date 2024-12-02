// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/nba/api/players/?id=');
    self.displayName = 'Player Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Birthdate = ko.observable('');
    self.CountryName = ko.observable('');
    self.PositionName = ko.observable('');
    self.DraftYear = ko.observable('');
    self.Height = ko.observable('');
    self.Weight = ko.observable('');
    self.School = ko.observable('');
    self.CountryId = ko.observable('');
    //self.Opened = ko.observable('');
    self.Photo = ko.observable('');
    self.ImageUrl = ko.observable('');
    self.Seasons = ko.observableArray([]);
    self.Teams = ko.observableArray([]);
    self.Rank = ko.observable('');
    self.TeamId = ko.observable('');
    self.Acronym = ko.observable('');
    self.SeasonRanks=ko.observable('');
    self.Seasontype = ko.observable("");
    self.Logo = ko.observable('');
    self.Team = ko.observable('');
    self.Season = ko.observable('');
    self.GamesPlayed = ko.observable('');
    self.MinutesPlayed = ko.observable('');
    self.FGMade = ko.observable('');
    self.FGAttempts = ko.observable('');
    self.FGPercentage = ko.observable('');
    self.ThreePtFGMade = ko.observable('');
    self.ThreePtFGAttempts = ko.observable('');
    self.ThreePtFGPercentage = ko.observable('');
    self.FTMade = ko.observable('');
    self.FTAttempts = ko.observable('');
    self.FTPercentage = ko.observable('');
    self.OffensiveRebounds = ko.observable('');
    self.DefensiveRebounds = ko.observable('');
    self.Rebounds = ko.observable('');
    self.Assists = ko.observable('');
    self.Steals = ko.observable('');
    self.Blocks = ko.observable('');
    self.Turnovers = ko.observable('');
    self.PersonalFouls = ko.observable('');
    self.PointsScored = ko.observable('');
    self.Efficency = ko.observable('');
    self.AST_TOV = ko.observable('');
    self.STL_TOV = ko.observable('');
    self.Teams = ko.observable([]);
    self.Seasons = ko.observable([]);
    self.updateLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }
   

    //--- Page Events

    self.activate = function (id) {

        console.log('CALL: getPlayer...');
        var composedUri = self.baseUri() + id;
        self.Seasontype(JSON.parse(localStorage.getItem("seasonType")));
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.Id(data.Id);
            self.Name(data.Name);
            self.Birthdate(data.Birthdate);
            self.CountryName(data.CountryName);
            self.CountryId(data.CountryId);
            self.PositionName(data.PositionName);
            self.DraftYear(data.DraftYear);
            self.Height(data.Height);
            self.Weight(data.Weight);
            self.School(data.School);
            //self.Opened(data.Opened);
            self.Photo(data.Photo);
            self.Seasons(data.Seasons);
            self.Teams(data.Teams);
            var composedUri2 = 'http://192.168.160.58/NBA/api/Statistics/PlayerRankBySeason?playerId=' + id;
            ajaxHelper(composedUri2, 'GET').done(function (data) {
                self.SeasonRanks(data)

                var labels = []
                var dataGraph = []

                data.forEach(element => {
                    labels.push(element.Season)
                    dataGraph.push(element.Rank)
                });
                console.log(dataGraph, labels)
                const ctx = $('#rankingsGraph');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Rank',
                            data: dataGraph,
                            borderWidth: 1,
                            backgroundColor: [
                                'rgba(255, 0, 0)'
                            ],
                            borderColor: [
                                'rgba(255, 0, 0)'
                            ],
                        }]
                    }
                });
            })

           
            
            if (data.ImageUrl != null) {
                self.ImageUrl(data.ImageUrl);
            } else {
                self.ImageUrl("https://static.vecteezy.com/system/resources/previews/026/778/699/non_2x/basketball-player-silhouette-nba-sports-game-set-design-free-vector.jpg")
            };
            self.Name(data.Name);
           
            hideLoading();
        });
    };
    self.detailsButton = (_event,_data) =>{
        showLoading();
        console.log(_data);
        seasondata = _data
        ajaxHelper("http://192.168.160.58/NBA/API/Players/Statistics?id="+ self.Id()+"&seasonId=" + _data.Id, 'GET').done(function (data) {
            
            if (self.Seasontype()==='Playoffs'){
                stats = data.Playoff 
            }
            else{
                self.Seasontype("Regular Season")
                stats = data.Regular
            }
            console.log(data)
            console.log(stats);
            console.log(stats);
            self.Season(data.Season);
            self.TeamId(String(data.TeamId));
            console.log(data.TeamId)
            self.Acronym(data.Acronym);
            self.Rank(stats.Rank);
            self.GamesPlayed(stats.GamesPlayed);
            self.MinutesPlayed(stats.MinutesPlayed);
            self.FGMade(stats.FGMade);
            self.FGAttempts(stats.FGAttempts);
            if (stats.FGPercentage != null && String(stats.FGPercentage).includes(',')){
                self.FGPercentage((parseFloat(stats.FGPercentage.replace(',', '.')) * 100).toFixed(1));}
            else if (stats.FGPercentage != null){self.FGPercentage((parseFloat(stats.FGPercentage) * 100).toFixed(1));}
            else{self.ThreePtFGPercentage(null)}
            self.ThreePtFGMade(stats.ThreePtFGMade);
            self.ThreePtFGAttempts(stats.ThreePtFGAttempts);
            if (stats.ThreePtFGPercentage != null && String(stats.ThreePtFGPercentage.includes(','))){
                self.ThreePtFGPercentage((parseFloat(stats.ThreePtFGPercentage.replace(',', '.')) * 100).toFixed(1));}
            else if (stats.ThreePtFGPercentage != null){self.ThreePtFGPercentage((parseFloat(stats.ThreePtFGPercentage) * 100).toFixed(1));}
            else{self.FGPercentage(null)}
            self.FTMade(stats.FTMade);
            self.FTAttempts(stats.FTAttempts);
            if (stats.FTPercentage != null && String(stats.FTPercentage).includes(',')){
                self.FTPercentage((parseFloat(stats.FTPercentage.replace(',', '.')) * 100).toFixed(1));}
            else if (stats.FTPercentage != null){self.FTPercentage((parseFloat(stats.FTPercentage) * 100).toFixed(1));}
            else{self.FTPercentage(null)}
            self.OffensiveRebounds(stats.OffensiveRebounds);
            self.DefensiveRebounds(stats.DefensiveRebounds);
            self.Rebounds(stats.Rebounds);
            self.Assists(stats.Assists);
            self.Steals(stats.Steals);
            self.Blocks(stats.Blocks);
            self.Turnovers(stats.Turnovers);
            self.PersonalFouls(stats.PersonalFouls);
            self.PointsScored(stats.PointsScored);
            self.Efficency(stats.Efficency);
            self.AST_TOV(stats.AST_TOV);
            self.STL_TOV(stats.STL_TOV);
            if (data.TeamId != null && data.Acronym != null){
                ajaxHelper("http://192.168.160.58/NBA/API/Teams?id="+ data.TeamId + "&Acronym=" + data.Acronym, 'GET').done(function (data) {
                    self.Team(data.Name);
                    if (data.Logo==null){
                        self.Logo("https://images.gamebanana.com/img/ss/tuts/100-90_619fe17d4ff4c.jpg");
                    }
                    else{self.Logo(data.Logo)}
                });
            }
            hideLoading();
            $('#statisticsModal').modal('show', {
                backdrop: 'static',
                keyboard: false
            });
        });
    };

    $("#Seasonchanger").click(function(){
        console.log("dert")
        if (self.Seasontype() == "Playoffs") self.Seasontype("Regular Season");
        else self.Seasontype("Playoffs");
        self.detailsButton("event", seasondata);
        localStorage.setItem("seasonType", JSON.stringify(self.Seasontype()));
    });
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
    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
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
});
