import React from 'react';
import { Col, Row, Button, Collapse } from 'reactstrap';
import ContentEditable from 'react-contenteditable';

import EditableParagraph from '../EditableParagraph/EditableParagraph'
import QuickToolbar from '../../../../containers/Dispositif/QuickToolbar/QuickToolbar';
import CardParagraphe, {PlusCard} from '../../../../containers/Dispositif/CardParagraphe/CardParagraphe';

const contenuParagraphe = (props) => {
  let item=props.item;

  const safeUiArray = (key, subkey, node) => props.uiArray[key] && props.uiArray[key].children && props.uiArray[key].children.length>subkey && props.uiArray[key].children[subkey] && props.uiArray[key].children[subkey][node]

  return(
    <div className={item.type==='cards' ? 'row cards' : 'sous-paragraphe'}>
      {item.children && item.children.map((subitem, subkey) => {
        if(subitem.type==='card'){
          return ( 
            <CardParagraphe 
              key={subkey}
              subkey={subkey}
              subitem={subitem}
              {...props} />
          )
        }else if(subitem.type==='accordion'){
          return ( 
            <div key={subkey} onMouseEnter={()=>props.updateUIArray(props.keyValue, subkey, 'isHover')}>
              <Row className="relative-position">
                <Col lg="12">
                  <Button id="accordion-header" color="warning" className="text-left" onClick={() => props.updateUIArray(props.keyValue, subkey, 'accordion', !safeUiArray(props.keyValue, subkey, 'accordion'))} aria-expanded={safeUiArray(props.keyValue, subkey, 'accordion')} aria-controls={"collapse" + props.keyValue + "-" + subkey}>
                    <h5>
                      <div className="accordion-number">{subkey+1}</div>
                      <span className="accordion-text">
                        <ContentEditable
                          id={props.keyValue}
                          data-subkey={subkey}
                          data-target='title'
                          html={subitem.title}  // innerHTML of the editable div
                          disabled={props.disableEdit}       // use true to disable editing
                          onChange={props.handleMenuChange} // handle innerHTML change
                          onClick={e=>e.stopPropagation()} />
                      </span>
                      <div className="accordion-expand">+</div>
                    </h5>
                  </Button>
                  <Collapse isOpen={safeUiArray(props.keyValue, subkey, 'accordion')} data-parent="#accordion" id={"collapse" + props.keyValue + "-" + subkey} aria-labelledby={"heading" + props.keyValue + "-" + subkey}>
                    <EditableParagraph 
                      idx={props.keyValue} 
                      subkey={subkey} 
                      handleMenuChange={props.handleMenuChange}
                      onEditorStateChange={props.onEditorStateChange}
                      handleContentClick={props.handleContentClick}
                      disableEdit={props.disableEdit}
                      {...subitem} />
                  </Collapse>
                </Col>
                <Col className='toolbar-col'>
                  <QuickToolbar
                    show={safeUiArray(props.keyValue, subkey, 'isHover')}
                    keyValue={props.keyValue}
                    subkey={subkey}
                    {...props} />
                </Col>
              </Row>
            </div>
          )
        }else{
          return ( 
            <div key={subkey} onMouseEnter={()=>props.updateUIArray(props.keyValue, subkey, 'isHover')}>
              <Row className="relative-position">
                <Col lg="12">
                  <h4>
                    <ContentEditable
                      id={props.keyValue}
                      data-subkey={subkey}
                      data-target='title'
                      html={subitem.title}  // innerHTML of the editable div
                      disabled={props.disableEdit}       // use true to disable editing
                      onChange={props.handleMenuChange} // handle innerHTML change
                    />
                  </h4>
                  <EditableParagraph 
                    idx={props.keyValue} 
                    subkey={subkey} 
                    handleMenuChange={props.handleMenuChange}
                    onEditorStateChange={props.onEditorStateChange}
                    handleContentClick={props.handleContentClick}
                    disableEdit={props.disableEdit}
                    {...subitem} />
                  <br />
                </Col>
                <Col className='toolbar-col'>
                  <QuickToolbar
                    show={props.uiArray[props.keyValue] && props.uiArray[props.keyValue].children && props.uiArray[props.keyValue].children.length>subkey && props.uiArray[props.keyValue].children[subkey] && props.uiArray[props.keyValue].children[subkey].isHover}
                    keyValue={props.keyValue}
                    subkey={subkey}
                    {...props} />
                </Col>
              </Row>
            </div>
          )
        }}
      )}
      {item.type==='cards' && item.children && item.children.length>0 && item.children[0].type === 'card' && 
        <PlusCard {...props} />}
    </div>
)
}

export default contenuParagraphe;