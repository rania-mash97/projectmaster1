import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Picker,
  TextInput,
  CheckBox,
  TouchableOpacity,
  Button
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button as ComponentButton,Icon,Input } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import { Divider,Header ,Card ,ListItem} from 'react-native-elements';
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class DetailsAboutPatients extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.getData=this.getData.bind(this);
        this.state={
      username:"",
      email:'',
      idDoctor:"",
      idPatient:'',
      patientInfo:[],
      search:[],
      view:false,
      noInfo:false,
      type:'',
      session:[],
      appointment:[],
      noSession:false,
    
      date:'',
      time:'',
      clinic:'',
      available:false,

      ///
      money:'',
      notes:'',
      process:[],
      medicines:[],
      exams:[],
      show:false,
      sessionDate:'',
      sessionSelected:''

    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
  }

  
  
  authListener(){
  
    const { navigation } = this.props;  
    var idP=navigation.getParam('id');
    var idD=navigation.getParam('idDoctor');
    var t=navigation.getParam('type');

    var date=navigation.getParam('date');
    var time=navigation.getParam('time');
    var clinic=navigation.getParam('clinic');
    var av=navigation.getParam('available');

    

     this.setState({
      idPatient:idP,
      idDoctor:idD,
      type:t,
      date:date,
      time:time,
      clinic:clinic,
      available:av
     })
     
   fire.database().ref("users").child(idP).child("name").on('value',(datasnapshot)=>{
    this.setState({
      username:datasnapshot.val()
    })
 })
    
 fire.database().ref("users").child(idP).child("email").on('value',(datasnapshot)=>{
    this.setState({
      email:datasnapshot.val()
    })
 })
 fire.database().ref("users").child(idD).child("patients").on('value',(snapshot)=>{
     if(snapshot.val()){
        let data = Object.values(snapshot.val());
    this.setState({
      patientInfo:data,
      noInfo:false
    })
    
     }
    
     else{
         this.setState({
          noInfo:true
         })
     }

   })
 
  }

 getData(id,num){
   
    this.setState({show:true,sessionSelected:num});
    this.state.patientInfo.map((value,index)=>{
        if(value.idPatient==id && value.sessionNumber==num){
            this.setState({
                money:value.money,
                notes:value.notes,
                sessionDate:value.date
            })
        }
    })///map patientInfo

    //get process
    var array1=[];
    fire.database().ref("users").child(this.state.idDoctor).child("processes").on('value',(pro)=>{
        if(pro.val()){
        let res=Object.values(pro.val());
        res.map((value)=>{
            if(value.idPatient ==id && value.sessionNumber==num){
                    array1.push({process:value.process});
            }
        })
        if(array1.length==0){array1.push({process:'Nothing done'})}

        this.setState({
            process:array1
        })
    }
    }) //pro fire

    //get medicines
    var array2=[];
    fire.database().ref("users").child(this.state.idDoctor).child("medicines").on('value',(med)=>{
        if(med.val()){
        let res=Object.values(med.val());
        var noMed='';
        res.map((value)=>{
            if(value.idPatient ==id && value.sessionNumber==num){
                    array2.push({medicine:value.medicine});
            }
           
        })
          if(array2.length==0){array2.push({medicine:'No medicine Written'})}
        this.setState({
            medicines:array2
        })
    }
    }) //medicine fire

     //get exams
     var array3=[];
     fire.database().ref("users").child(this.state.idDoctor).child("checkup").on('value',(ch)=>{
         if(ch.val()){
         let res=Object.values(ch.val());
         res.map((value)=>{
             if(value.idPatient ==id && value.sessionNumber==num){
                     array3.push({exam:value.exam});
             }
         })
         if(array3.length==0){array3.push({exam:'No medical checkup needed'})}

         this.setState({
            exams:array3
         })
        }
     }) //medicine fire
    
 }



  render() {

    return(
    
         

       <View>
            <ScrollView
              showsVerticalScrollIndicator={true}
              style={{ width, marginTop: '25%' }}
            >
            <View>
            <Text bold size={20} style={{color:'#000'}}>Sessions Report</Text>
            </View>
                    <View style={{flexDirection:'row',flexWrap:'wrap'}} >
                  { !this.state.noInfo && this.state.patientInfo.map((value,index)=>{
                      if(value.idPatient==this.state.idPatient){//???? ?????? ???????? ?????????? ?????????????? ?? ???????????? ????????????
                      // ?? ???? ???? ???????? ???????? 
                                return(
                                    <View style={{marginTop:5}} key={index}>
                                        <ComponentButton small
                                        style={{marginLeft:10,backgroundColor:"#333"}}
                                        onPress={()=>this.getData(value.idPatient,value.sessionNumber)}
                                        >
                                            <Text style={{color:'#fff'}}>{value.sessionNumber}</Text>
                                        </ComponentButton>
                                    </View>
                                )
                              }
                   })}
                    </View>
                       
                       <Divider style={{backgroundColor:'#000',marginTop:10,width:width*0.4}}/>

                       <View style={{flexDirection:'row',marginTop:10}}>
                          <View style={{flexDirection:'column',marginLeft:20}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Name</Text>
                              <Text style={{color:'#aaa'}}>{this.state.username}</Text>
                          </View>

                          <View style={{flexDirection:'column',marginLeft:60}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Email</Text>
                              <Text style={{color:'#aaa'}}>{this.state.email}</Text>
                          </View>
                       </View>
                       <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

{this.state.show &&  <View >
                       <View style={{marginTop:10,flexDirection:'column'}}>
                                <View style={{flexDirection:'row',marginTop:10}}>
                                <Text style={{marginLeft:10}}>{"session \xa0\xa0"+this.state.sessionSelected}</Text>
                                <Text style={{marginLeft:60}}>{this.state.sessionDate}</Text>
                                </View>
                       </View>
                    <View style={{marginTop:10,flexDirection:'column'}}>
                    <Text bold size={16} style={{color:'#004D40',marginLeft:10}}>Processes</Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap'}}>

                        { this.state.process.map((pro,index)=>{
                            return(
                                <View style={{marginLeft:10,marginTop:5
                                //,flex: 1, justifyContent: 'center',alignItems: 'flex-start'
                                }}
                                key={index}
                                >
                                <Text
                                   style={{borderRadius:4,backgroundColor:'#eee',padding:10}}
                                        >
                                        {pro.process}
                                         </Text>   
                                        
                                </View>
                            )
                        })}
                    </View>
                    </View>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

                    <View style={{marginTop:10,flexDirection:'column'}}>
                    <Text bold size={16} style={{color:'#004D40',marginLeft:10}}>Medicines :</Text>
                           <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        { this.state.medicines.map((med,index)=>{
                            return(
                                <View style={{marginLeft:10,marginTop:5}} key={index}>
                                <Text 
                                   style={{borderRadius:4,backgroundColor:'#eee',padding:10}}
                                        >
                                            {med.medicine}
                                        </Text>
                                </View>
                            )
                        })}
                        </View>
                    </View>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>
                
                   
                    <View style={{marginTop:10,flexDirection:'column',flexWrap:'wrap'}}>
                    <Text bold size={16} style={{color:'#004D40',marginLeft:10}}>Medical checkup :</Text>
                    <View style={{flexDirection:'row'}}>

                        { this.state.exams.map((ex,index)=>{
                            return(
                                <View style={{marginLeft:10,marginTop:5}} key={index}>
                                <Text 
                                   style={{borderRadius:4,backgroundColor:'#eee',padding:10}}
                                        >
                                            {ex.exam}
                                        </Text>
                                        
                                </View>
                            )
                        })}
                        </View>
                    </View>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

                         <View style={{flexDirection:'column',marginTop:10}}>
                             <Text bold size={16} style={{color:'#004D40',marginLeft:10}}>Money paid :</Text>
                            <Text style={{color:'#333',marginLeft:10}}>{this.state.money ||"No money paid"}</Text>
                         </View>
                         <Divider style={{backgroundColor:'#E9ECEF',marginTop:10,marginLeft:20}}/>
                         <View style={{flexDirection:'column',marginTop:10}}>
                             <Text bold size={16} style={{color:'#004D40',marginLeft:10}}>Any Notes :</Text>
                            <Text style={{color:'#333',marginLeft:10}} >{this.state.notes || "No Notes"}</Text>
                         </View>
                         <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

</View> 
}

            </ScrollView>
          
            </View>
    
    )
    }
  
  }


const styles = StyleSheet.create({
  
  
  
 
  
});

export default DetailsAboutPatients;