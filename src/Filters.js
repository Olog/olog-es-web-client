/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import React, {Component} from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Logbooks from './Logbooks'
import Tags from './Tags'
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

class Filters extends Component{

    state ={
        open: false
    };

    toggle = () => {
        this.setState({open: !this.state.open});
    }

    render(){
        return(
            <>
              <h6>Filter Log Entries</h6>
                <Accordion>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Card.Header} eventKey="0" onClick={this.toggle}>
                      { this.state.open ? <FaChevronDown /> : <FaChevronRight/> } LOGBOOKS
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                       <Card.Body><Logbooks logbooks={this.props.logbooks}/></Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <Accordion>
                  <Card>
                    <Card.Header>
                      <Accordion.Toggle as={Card.Header} eventKey="0" onClick={this.toggle}>
                      { this.state.open ? <FaChevronDown /> : <FaChevronRight/> } TAGS
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                       <Card.Body><Tags tags={this.props.tags}/></Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
            </>
        )
    }
}

export default Filters;