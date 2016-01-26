import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import Events from './Events';

/**
 * Timer that fires an event every X seconds.
 */
class EventTimer extends Marionette.Object
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize(options)
    {
        this._initializeRadio();
        this._event = null;
        this._options = null;
        this._frequency = options.frequency;
        this._timer = null;
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this._rodanChannel = Radio.channel('rodan');
        this._rodanChannel.reply(Events.REQUEST__SET_TIMED_EVENT, (options) => this._handleSetTimedEvent(options));
        this._rodanChannel.reply(Events.REQUEST__SET_TIMED_REQUEST, (options) => this._handleSetTimedRequest(options));
        this._rodanChannel.reply(Events.REQUEST__CLEAR_TIMED_EVENT, () => this._handleClearTimedEvent());
        this._rodanChannel.on(Events.EVENT__TIMER_TEST, (options) => this._handleTimerTestEvent(options));
        this._rodanChannel.reply(Events.REQUEST__TIMER_TEST, (options) => this._handleTimerTestRequest(options));
    }

    /**
     * Handles call to set timed event.
     */
    _handleSetTimedEvent(options)
    {
        this._clearTimer();
        this._event = options.event;
        this._options = options.options;
        this._timer = setTimeout(() => this._fireEvent(), this._frequency);
    }

    /**
     * Handles call to set timed request.
     */
    _handleSetTimedRequest(options)
    {
        this._clearTimer();
        this._event = options.request;
        this._options = options.options;
        this._callback = options.callback;
        this._timer = setTimeout(() => this._fireRequest(), this._frequency);
    }

    /**
     * Handles call to clear timed event.
     */
    _handleClearTimedEvent(options)
    {
        this._clearTimer();
    }

    /**
     * Fires the event.
     */
    _fireEvent()
    {
        if (this._event != null)
        {
            this._rodanChannel.trigger(this._event, this._options);
            this._timer = setTimeout(() => this._fireEvent(), this._frequency);
        }
    }

    /**
     * Fires the request.
     */
    _fireRequest()
    {
        if (this._event != null)
        {
            var response = this._rodanChannel.request(this._event, this._options);
            if (this._callback !== null)
            {
                this._callback(response);
            }
            this._timer = setTimeout(() => this._fireRequest(), this._frequency);
        }
    }

    /**
     * Handle timer test event.
     */
    _handleTimerTestEvent(options)
    {
        console.log('Fired Event ' + this._event + ' with options ' + this._options);
    }

    /**
     * Handle timer test request.
     */
    _handleTimerTestRequest(options)
    {
        console.log('Fired Request ' + this._event + ' with options ' + this._options);
        return true;
    }

    /**
     * Set the timer to an Event.
     */
    _setTimerEvent()
    {
        setInterval(this._rodanChannel.trigger(options.event, options._options), this._frequency);
    }

    /**
     * Set the timer to a Request.
     */
    _setTimerRequest()
    {
        setInterval(this._rodanChannel.request(options.event, options._options), this._frequency);
    }

    /**
     * Clears the timer.
     */
    _clearTimer()
    {
        if (this._timer !== null)
        {
            clearInterval(this._timer);
        }
        this._event = null;
        this._options = null;
        this._callback = null;
    }
}

export default EventTimer;