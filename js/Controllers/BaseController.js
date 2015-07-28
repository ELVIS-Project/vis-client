import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

/**
 * Base controller.
 */
class BaseController extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Constructor.
     */
    constructor(aOptions)
    {
        this._rodanChannel = Radio.channel('rodan');
        this._initializeViews();
        this._initializeRadio();
        super(aOptions);
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize Radio.
     */
    _initializeRadio()
    {
        console.log('TODO - this must be implemented in the inheriting class');
    }

    /**
     * Initialize views.
     */
    _initializeViews()
    {
    }
}

export default BaseController;