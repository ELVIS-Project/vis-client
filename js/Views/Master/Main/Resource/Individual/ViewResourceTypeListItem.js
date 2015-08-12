import Marionette from 'backbone.marionette';

/**
 * ResourceType view.
 */
class ViewResourceTypeListItem extends Marionette.ItemView
{
///////////////////////////////////////////////////////////////////////////////////////
// PUBLIC METHODS
///////////////////////////////////////////////////////////////////////////////////////
    /**
     * Set the value of the 'option.value'.
     */
    onRender()
    {
        this.$el.attr('value', this.model.get('url'));
    }
}

///////////////////////////////////////////////////////////////////////////////////////
// PROTOTYPE
///////////////////////////////////////////////////////////////////////////////////////
ViewResourceTypeListItem.prototype.modelEvents = {
    'all': 'render'
};
ViewResourceTypeListItem.prototype.template = '#template-main_resource_individual_resourcetype_list_item';
ViewResourceTypeListItem.prototype.tagName = 'option';

export default ViewResourceTypeListItem;