const urlLocalidate = 'https://servicodados.ibge.gov.br/api/v1/localidades'
const urlViaCEP = data => `https://viacep.com.br/ws/${data}/json/`

const fetchFacilitator = ( url, callback ) =>
    fetch( url )
    .then( response => response.json() )
    .then( json => callback( json ) )

export const getCEP = ( data, callback ) => 
    fetchFacilitator( urlViaCEP(data), callback )

export const getStates = callback =>   
    fetchFacilitator( `${urlLocalidate}/estados`, callback )

export const getCity = ( id, callback ) => 
    fetchFacilitator( `${urlLocalidate}/estados/${id}/municipios`, callback )
