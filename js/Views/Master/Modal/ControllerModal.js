import $ from 'jquery';
import jqueryui from 'jqueryui';

import BaseController from '../../../Controllers/BaseController';
import Configuration from '../../../Configuration';
import Events from '../../../Shared/Events';
import LayoutViewMasterModal from './LayoutViewMasterModal';

/**
 * Controls modals.
 */
class ControllerModal extends BaseController
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize.
     */
    initialize()
    {
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Initialize radio.
     */
    _initializeRadio()
    {
        this._rodanChannel.reply(Events.REQUEST__MODAL_HIDE, () => this._handleRequestModalHide());
        this._rodanChannel.reply(Events.REQUEST__MODAL_SHOW, options => this._handleRequestModalShow(options));
        this._rodanChannel.reply(Events.REQUEST__MODAL_SHOW_WAITING, () => this._handleRequestModalShowWaiting());
    }

///////////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS - Radio handlers
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handle request modal hide.
     */
    _handleRequestModalHide()
    {
        var $modalElement = $("#modal-generic");
        $modalElement.modal('hide');
    }

    /**
     * Handle request modal show.
     */
    _handleRequestModalShow(options)
    {
        this._layoutViewModal = new LayoutViewMasterModal({template: '#template-modal'});
        this._layoutViewModal.addRegions({modal_resource_list: '#region-modal_resource_list'});
        this._layoutViewModal.render();
        this._layoutViewModal.getRegion('modal_resource_list').show(options.view);
        var $modalEl = $("#modal-generic");
        $modalEl.css({top: 0, left: 0, position: 'absolute'});
        $modalEl.html(this._layoutViewModal.el);
        $modalEl.draggable({handle: ".modal-header"});
        $modalEl.modal({backdrop: 'static'});
    }

    /**
     * Handle request modal show waiting.
     */
    _handleRequestModalShowWaiting(options)
    {
        this._layoutViewModal = new LayoutViewMasterModal({template: '#template-modal_waiting'});
        this._layoutViewModal.render();
        var $modalEl = $("#modal-generic");
        $modalEl.css({top: 0, left: 0, position: 'absolute'});
        $modalEl.html(this._layoutViewModal.el);
        $modalEl.modal({backdrop: 'static', keyboard: false});
    }
}

export default ControllerModal;