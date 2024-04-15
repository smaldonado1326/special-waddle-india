
$(document).ready(function() {
    // Initial data arrays for dropdowns
    const defaultAgeOptions = {
        '18': ['Freshman', 'Sophomore'],
        '19': ['Sophomore', 'Junior'],
        '20': ['Junior', 'Senior'],
        '21': ['Senior']
    };
    
    const defaultTeamOptions = {
        'Freshman': ['Team A', 'Team B'],
        'Sophomore': ['Team C', 'Team D'],
        'Junior': ['Team E', 'Team F'],
        'Senior': ['Team G', 'Team H']
    };

    // Function to populate a dropdown with options
    function populateDropdown(dropdown, options) {
        dropdown.empty();
        dropdown.append('<option value="" selected="selected">Select</option>');
        options.forEach(option => {
            dropdown.append(`<option value="${option}">${option}</option>`);
        });
    }

    // Function to populate dropdowns with default data for manual input
    function populateDropdownsWithDefaultData() {
        populateDropdown($('#subject'), Object.keys(defaultAgeOptions));
        $('#subject').on('change', function() {
            const selectedAge = $(this).val();
            if (selectedAge) {
                populateDropdown($('#topic'), defaultAgeOptions[selectedAge]);
            } else {
                populateDropdown($('#topic'), []);
            }
            populateDropdown($('#chapter'), []);
        });

        $('#topic').on('change', function() {
            const selectedYear = $(this).val();
            if (selectedYear) {
                populateDropdown($('#chapter'), defaultTeamOptions[selectedYear]);
            } else {
                populateDropdown($('#chapter'), []);
            }
        });
    }

    // Populate dropdowns with default data when the page loads
    populateDropdownsWithDefaultData();

    // Event handler for loading JSON data button
    $('#loadJsonButton').on('click', function() {
        // Load JSON data and fill in the form fields
        $.getJSON('Data/Info.json', function(data) {
            const userData = data.user;

            // Fill in the form fields
            $('#name').val(userData.name);
            $('#email').val(userData.email);
            $('#dob').val(userData.dob);
            $('#subject').val(userData.age);
            $('#topic').val(userData.year);
            $('#chapter').val(userData.team);
            $('#phone').val(userData.phone);

            // Populate age and team options based on JSON data
            const ageOptions = data.ages.reduce((acc, ageGroup) => {
                acc[ageGroup.age] = ageGroup.years.map(yearGroup => yearGroup.year);
                return acc;
            }, {});

            const teamOptions = data.ages.reduce((acc, ageGroup) => {
                ageGroup.years.forEach(yearGroup => {
                    acc[yearGroup.year] = yearGroup.teams;
                });
                return acc;
            }, {});

            // Populate the dropdowns with age and team options
            populateDropdown($('#subject'), Object.keys(ageOptions));
            $('#subject').val(userData.age).change();
            populateDropdown($('#topic'), ageOptions[userData.age]);
            $('#topic').val(userData.year).change();
            populateDropdown($('#chapter'), teamOptions[userData.year]);
            $('#chapter').val(userData.team);
        });
    });

    // Function to display form data
    function displayFormData() {
        const name = $('#name').val();
        const email = $('#email').val();
        const dob = $('#dob').val();
        const phone = $('#phone').val();
        const age = $('#subject').val();
        const year = $('#topic').val();
        const team = $('#chapter').val();

        // Display the gathered data in the specified div
        $('#formDataDisplay').html(`
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Date of Birth: ${dob}</p>
            <p>Phone Number: ${phone}</p>
            <p>Age: ${age}</p>
            <p>Year: ${year}</p>
            <p>Based on your input, you will play for team: ${team}</p>
        `);
    }

    // Event handler for form submission
    $('#signupForm').on('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Check form validation
        if (!event.target.checkValidity()) {
            event.target.reportValidity();
            return;
        }

        // Display the form data
        displayFormData();
    });

    // Handle the Clear button
    $('button[type="reset"]').on('click', function() {
        // Reset the form fields to their initial values
        $('#signupForm')[0].reset();

        // Repopulate dropdowns with default data
        populateDropdownsWithDefaultData();

        // Clear any displayed form data
        $('#formDataDisplay').html('');
    });

    // Functionality for "Show Password" checkbox
    $('#showPassword').on('change', function() {
        const passwordField = $('#password');
        if (this.checked) {
            passwordField.attr('type', 'text'); // Show password
        } else {
            passwordField.attr('type', 'password'); // Hide password
        }
    });
});
