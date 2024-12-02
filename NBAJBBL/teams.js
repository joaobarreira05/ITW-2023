var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Teams');
    self.displayName = 'NBA Teams List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.Id = ko.observable('');
    self.Acronym = ko.observable('');
    self.Logo = ko.observable('');
    self.search = function () {
        console.log("searching");
        if ($("#searchbar").val() === "") {
            showLoading();
            var pg = getUrlParameter('page');
            console.log(pg);
            if (pg == undefined)
                self.activate(1);
            else {
                self.activate(pg);
            }
        } else {
            var changeUrl = 'http://192.168.160.58/NBA/API/Teams/Search?q=' + $("#searchbar").val();
            self.playerslist = [];
            ajaxHelper(changeUrl, 'GET').done(function (data) {
                console.log(data.length);
                if (data.length == 0) {
                    return alert('No results found');
                }
                self.totalPages(1);
                console.log(data);
                showLoading();
                self.records(data);
                self.totalRecords(data.length);
                hideLoading();
                for (var i in data) {
                    self.playerslist.push(data[i]);
                }
            });
        }
    };
    self.favoriteTeam = function (team, event) {
        console.log('favorite click!');
        var heartIcon = event.currentTarget.querySelector('.fa-heart');
    
        // Retrieve existing favorites from local storage
        var favorites = JSON.parse(window.localStorage.getItem('favTeams0')) || [];
    
        // Check if the team is already favorited
        var existingIndex = favorites.findIndex(function (fav) {
            return fav.id === team.Id;
        });
    
        if (existingIndex !== -1) {
            // Team is already favorited, remove it
            favorites.splice(existingIndex, 1);
            window.localStorage.setItem('favTeams0', JSON.stringify(favorites));
            heartIcon.classList.remove('favorite');
            console.log('Team removed from favorites');
        } else {
            // Team is not favorited, add it
            favorites.push({
                id: team.Id,
                acronym: team.Acronym
            });
            window.localStorage.setItem('favTeams0', JSON.stringify(favorites));
            heartIcon.classList.add('favorite');
            console.log('Team added to favorites');
        }
    
        console.log(JSON.parse(window.localStorage.getItem('favTeams0')));
    };
   
    self.onEnter = function (d, e) {
        e.keyCode === 13 && self.search();
        return true;
    };
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getTeams...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            self.Id(data.Records[0].Id);
            self.Acronym(data.Records[0].Acronym);
        });
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
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
    $("#searchbar").autocomplete({
        minLength: 3,
        autoFill: true,
        source: function (request, response) {
            $.ajax({
                type: 'GET',
                url: 'http://192.168.160.58/NBA/API/Teams/Search?q=' + $("#searchbar").val(),
                success: function (data) {
                    response($.map(data, function (item) {
                        return item.Name;
                    }));
                },
                error: function (result) {
                    alert(result.statusText);
                },
            });
        },
        select: function (e, ui) {
            $.ajax({
                type: 'GET',
                url: 'http://192.168.160.58/nba/api/teams/search?q=' + ui.item.label,
                success: function (data) {
                    window.location = 'teamdetails.html?id=' + data[0].Id + "&acronym=" + data[0].Acronym;
                }
            })
        },
        messages: {
            noResults: '',
            results: function () { }
        }
    });
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});