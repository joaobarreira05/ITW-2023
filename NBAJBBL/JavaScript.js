const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode if the preference is set
if (isDarkMode) {
    enableDarkMode();
}

// Toggle dark mode on button click
$('#darkModeToggle').on('change', function () {
    if ($(this).is(':checked')) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

// Function to enable dark mode
function enableDarkMode() {
    $('body').addClass('dark-mode');
    $('nav').addClass('dark-mode');

    $('accordionFlushExample').addClass('dark-mode');

    $('modal').addClass('dark-mode');
    // Adicione a classe 'dark-mode' a tabelas, cartões e ripped tables
    $('table, .card, .ripped-table').addClass('dark-mode');

    localStorage.setItem('darkMode', 'true');
}

// Function to disable dark mode
function disableDarkMode() {
    $('body').removeClass('dark-mode');
    $('accordionFlushExample').removeClass('dark-mode');
    $('nav').removeClass('dark-mode');
    $('modal').removeClass('dark-mode');
    // Remova a classe 'dark-mode' de tabelas, cartões e ripped tables
    $('table, .card, .ripped-table').removeClass('dark-mode');

    localStorage.setItem('darkMode', 'false');
}