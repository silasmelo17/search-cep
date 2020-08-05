import { getCEP, getStates, getCity } from './fetchData.js'
import { getListOfCEP, createOptionsListOfStates } from './getHTMLStructure.js'

const selector = id => document.querySelector(id)

const form = selector('form')
const searchAddress = selector('.search-address')
const listCities = selector('#list-cities')
const resultContainer = selector('.result')
const pagination = selector('.pagination')
const error = selector('.error')
const changeSearch = selector('.lowlight')
const btnClear = selector('.clear')
const states = selector('#states')
const city = selector('#city')
const search = selector('#search')




const resetField = ( field, properties ) =>
	Object.keys( properties ).forEach( propsName => { 
		const prop = field[propsName] 
		const getValue = properties[propsName]
		
		prop instanceof Object ? 
				resetField( prop, getValue ): field[propsName] = getValue
	})

const clearContainers = () => {
	error.textContent = ''
	pagination.innerHTML = ''
	resultContainer.innerHTML = ''
}

const clearFields = () => {
	resetField( states, { value: '', dataset: { uf: '' } } )
	resetField( city, {  value: '', disabled: true} )
	resetField( search, { value: '', disabled: selector('.hidden') === null } )

	clearContainers()
}




const resetSearch = ( value, disabled, type, placeholder ) =>
	({ value, disabled, type, placeholder })

const changeToAddress = () => {
	resetField( changeSearch, { 
		textContent: 'Quero informar meu CEP.',
		dataset: { search: 'address'} 
	})
	resetField( search, resetSearch( '', true, 'text', 'Logradouro' ) )
}

const changeToCEP = () => {
	resetField( changeSearch, { 
		textContent: 'Não sei meu CEP.',
		dataset: { search: 'cep'} 
	})
	resetField( search, resetSearch( '', false, 'number', 'CEP' ) )
}

changeSearch.addEventListener( 'click', event => {
	event.preventDefault()

	searchAddress.classList.toggle( 'hidden' )
	clearFields()

	const changeText = changeSearch.dataset.search === 'cep'
	changeText ? changeToAddress() : changeToCEP()
})




const clipboard = text => {
	const textarea = document.createElement('textarea')
	textarea.value = text

	document.body.appendChild(textarea)
	textarea.select()

	document.execCommand('copy')
	document.body.removeChild(textarea)   
}

const swapElementClass = ( element, className ) => {
	const previous = selector(`.${className}`)
	if( previous !== null ) 
			previous.classList.remove(className)
			
	element.classList.add( className )
}

resultContainer.addEventListener( 'click', event => {
	swapElementClass( event.target, 'copied' )
	clipboard( event.target.textContent )
})




const searchCity = json => listCities.innerHTML = json
  .reduce( (acc, {nome} ) => acc + `<option value='${nome}' />`, '' )

states.addEventListener( 'input', ({target}) => {
	const option = target[target.selectedIndex]
	states.dataset.uf = option.dataset.uf

	getCity( states.value, searchCity )
	resetField( city, { value:'', disabled: states.value === '' } )
})




const createButtonOfPagination = ( json, index ) => {
	const button = document.createElement('button')
	button.textContent = index + 1
	button.addEventListener( 'click', event => {
		resultContainer.innerHTML = getListOfCEP( json, index + 1, 7 )
		swapElementClass( button, 'page' )
	})

	if( index === 0 ) button.classList.add('page')

	return button
} 

const addPaginationButtons = ( json, size ) => {
	const btnLength = Math.ceil(json.length / size)
	if( json.length > size ) 
		new Array(btnLength).fill('')
		.map( ( value, index ) => createButtonOfPagination( json, index )  )
		.forEach( btn => pagination.appendChild( btn ) )
}




const printCEPResult = json => {
	clearContainers()
	if( json.erro === true || json === [] ) {
		const text = 'Nenhum cep encontrado, verifique se os dados estão corretos.'
		error.textContent = text
	} else {
		const size = 7
		resultContainer.innerHTML = getListOfCEP( json, 1, size )
		addPaginationButtons( json, size )
	}
}





const getFilledField = () => [ search.value, city.value, states.value ]
	.reduce( ( acc, value ) => {
		if ( typeof acc === 'string' )
				return acc
		return value === '' ? 'Preencha todos os campos.': true
	}, true )

const getAddressLength = () => search.value.length > 2 ||
  'O logradouro precisa ter ao menos 3 caracteres.'


const validateAddress = () => [ getFilledField(), getAddressLength() ]
	.reduce( ( acc, result ) => {
		if( typeof acc === 'string' )
			return acc
		return typeof result === 'string' ? result: true
	}, true)

const validateCEP = () => /^[0-9]{8}$/.test( search.value ) || 
  'O CEP deve conter 8 dígitos numéricos.'

const getValidateResult = () => changeSearch.dataset.search === 'cep'
	? validateCEP(): validateAddress()




const validateField = field => field === '' ? field : field + '/'
const getData = () => validateField( states.dataset.uf ) + 
  validateField( city.value ) + search.value

city.addEventListener( 'input', () => {
	const validate = city.value.length > 2 ? 
		{ disabled: false }: { disabled: true, value: '' }
	resetField( search, validate )
})

const submitEvent = event => {
	event.preventDefault()

	const validate = getValidateResult()
	if ( validate === true )
		getCEP( getData(), printCEPResult )
	else {
		clearContainers()
		error.textContent = validate
	}
}



btnClear.addEventListener( 'click' , clearFields )
form.addEventListener( 'submit', submitEvent )    

getStates( json => states.innerHTML = createOptionsListOfStates(json) )
