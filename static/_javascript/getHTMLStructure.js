
const createCEP = ({cep, logradouro, bairro, localidade, uf }) =>
  `<li><strong>${cep}</strong> - ${logradouro}, ${bairro} - ${localidade}/${uf}</li>`

const createCEPList = ( json, page, size ) => 
  `<p class='length' >${json.length} endereços encontrados.</p>` + json
  .sort( (a,b) => a.cep.localeCompare(b.cep) )
  .slice( (page-1)*size, page*size )
  .reduce( ( acc, address ) => acc + createCEP(address), '' )

export const getListOfCEP = (json, page, size ) => json instanceof Array 
  ? createCEPList( json, page, size ) 
  : createCEP(json)




const createOptionState = ({ id, sigla, nome }) => 
    `<option value='${id}' data-uf='${sigla}' >${sigla} - ${nome}</option>`

export const createOptionsListOfStates = json => 
  `<option value='' disabled selected >Estado</option>` + json
  .sort( (a,b) => a.sigla.localeCompare(b.sigla) )
  .reduce( ( acc, uf) => acc + createOptionState(uf), '')


