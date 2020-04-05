import React, { ChangeEvent } from 'react'
import ReactDOM from 'react-dom'
import languages from './resources/languages.json'

interface IState {
    from?: string
    to?: string
    transLang?: string
    phrase?: string
    results?: string
}

class Translator extends React.Component {

    state: IState

    constructor( props ){
        super( props )

        
        let to = window.navigator.language
        let from = to !== 'en' ? 'en' : 'de'

        // set initial state
        this.state = {
            from: from,
            to: to,
            phrase: '',
            results: ''
        }

        // bind functions
        this.toggle = this.toggle.bind( this )
        this.translate = this.translate.bind( this )
        this.update = this.update.bind( this )
        this.key = this.key.bind( this )
        this.from = this.from.bind( this )
        this.to = this.to.bind( this )
        this.copy = this.copy.bind( this )
        this.search = this.search.bind( this )
    }

    toggle(){
        this.setState( ( old: IState ): IState => {
            return {
                from: old.to,
                to: old.from,
                phrase: old.results,
                results: old.phrase
            }
        })

        document.getElementById('search-phrase').focus()
    }

    async translate(){
        let request = new XMLHttpRequest()
        let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
            + this.state.from + "&tl=" + this.state.to + "&dt=t&q=" + encodeURI( this.state.phrase );

        request.onload = () => {
            if( request.status === 200 ){
                let translation = JSON.parse( request.response )[0][0][0]
                this.setState( ( old: IState ): IState => {
                    return {
                        results: translation
                    }
                })
            }
        }
        request.open( 'GET', url, true )
        request.send()
    }

    update( event: ChangeEvent< HTMLInputElement > ){
        this.setState({
            phrase: event.currentTarget.value
        })
    }

    key( event: React.KeyboardEvent< HTMLInputElement > ){
        if( event.key !== 'Enter' ) return

        this.translate()
    }

    from( event: React.ChangeEvent< HTMLSelectElement > ){
        this.setState({
            from: event.currentTarget.value
        })
        document.getElementById('search-phrase').focus()
    }

    to( event: React.ChangeEvent< HTMLSelectElement > ){
        this.setState({
            to: event.currentTarget.value
        })
        document.getElementById('search-phrase').focus()
    }

    copy(){
        navigator.clipboard.writeText( this.state.results )
    }

    search(){
        let url = `https://www.google.com/search?client=firefox-b-d&q=${ this.state.results.split(' ').join('+') }`
        let win = window.open( url, '_blank' )
        win.focus();
    }

    componentDidMount(){
        document.getElementById('search-phrase').focus()
    }

    render(){
        return (
            <>
                < div id="languages" >
                    < select value={ this.state.from } onChange={ this.from } >
                        { Object.getOwnPropertyNames( languages ).map( lang => <option key={ lang } value={ languages[ lang ] } >{ lang }</option> ) }
                    </select>
                    < div className="button" id="toggle" onClick={ this.toggle } >{ < div id="toggle-icon" className="icon" /> }</ div >
                    < select value={ this.state.to } onChange={ this.to } >
                        { Object.getOwnPropertyNames( languages ).map( lang => <option key={ lang } value={ languages[ lang ] } >{ lang }</option> ) }
                    </select>
                </div>
                < div id="search-bar" >
                    < input id="search-phrase" onChange={ this.update } onKeyPress={ this.key } value={ this.state.phrase } />
                    < div className="button" id="search" onClick={ this.translate } >{ < div id="translate-icon" className="icon" /> }</ div >
                </ div >
                < div id="results" >
                    { this.state.results !== '' 
                        ? < div id="search-results" >{ this.state.results }</ div >
                        : null
                    }
                    { this.state.results !== '' 
                        ? < div className="button" id="to-clipboard" onClick={ this.copy }>{ < div id="clipboard-icon" className="icon" /> }</div> 
                        : null
                    }
                    { this.state.results !== '' 
                        ? < div className="button" id="search-in-google" onClick={ this.search }>{ < div id="search-icon" className="icon" /> }</div>
                        : null
                    }
                </div>
            </>
        )
    }
}

ReactDOM.render( < Translator />, document.getElementById('content') )