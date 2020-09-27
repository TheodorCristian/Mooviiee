const createAutoComplete = ({
    rootElement, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData
}) => {
    //setting the HTML architecture for the autocomplete
    rootElement.innerHTML = `
        <label><b>Search for a Movie</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;
//declaring some useful variables
const input = rootElement.querySelector('input');
const dropdown = rootElement.querySelector('.dropdown');
const results = rootElement.querySelector('.results');


const typeSomething = async (event) => {

    //making a request for the data that the user typed inside the input
    const elements = await fetchData(event.target.value);

    //if there is no data inside the input after the request was made and the response came back, the dropdown is closed
    if( !elements.length ) {
        dropdown.classList.remove('is-active');
        return;
    }
    results.innerHTML = '';
    dropdown.classList.add('is-active');

    // for every element from the request response, it's created an option on the dropdown menu with that element and it's rendered inside a anchor tag;
    for (let element of elements) {
        const anchorElement = document.createElement('a');
        anchorElement.classList.add('dropdown-item');

        //for every option we call the renderOption function that specifies how the option will be rendered (see into index.js)
        anchorElement.innerHTML = renderOption(element);
        
       //Adding an event listener that looks or the user's click on some of the options
        anchorElement.addEventListener('click', () => {

            //when a user clicks on an option, the dropdown menu will dissapear
            dropdown.classList.remove('is-active');

            //calling the inputValue function, the value of the input will be represented by the property set into the function return statement ( in this case the option Title)
            input.value = inputValue(element);

            //onOptionSelect will expand the informations about the element that has been choosed by the user 
            onOptionSelect(element)
        })

        //this method will add into our html component with the class of results the info that has been assembled in the code above
        results.appendChild(anchorElement);
    }
};
input.addEventListener('input', debounce(typeSomething, 500));
document.addEventListener('click', (event) => {
    if (!rootElement.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

};