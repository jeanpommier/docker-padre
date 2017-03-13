Ext.namespace("app");
app.CRS={};
var CRS=Ext.data.Record.create([{name:"authority"},{name:"code"},{name:"version"},{name:"codeSpace"},{name:"description"}]);
app.CRS.crsStore=new Ext.data.Store({proxy:new Ext.data.HttpProxy({url:"crs.search",method:"GET"}),baseParams:{name:"",type:"",maxResults:50},reader:new Ext.data.XmlReader({record:"crs",id:"code"},CRS),fields:["code","codeSpace","authority","description","version"],sortInfo:{field:"description"}});
app.CRSSelectionPanel=Ext.extend(Ext.FormPanel,{border:false,first:null,itemSelector:null,loadingMask:null,crsCount:null,ref:null,crsSelected:"",initComponent:function(){this.items=[{xtype:"panel",layout:"fit",bodyStyle:"padding: 5px;",border:false,tbar:[this.getCRSTypeCombo()," ",this.getCRS(),"->",translate("maxResults"),this.getLimitInput()],items:[this.getCRSItemSelector()]}];
app.CRS.crsStore.on({loadexception:function(){},beforeload:function(a,b){if(Ext.getCmp("maxResults")){a.baseParams.maxResults=Ext.getCmp("maxResults").getValue()
}if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(this.itemSelector.fromMultiselect.getEl(),{msg:translate("searching")})
}this.loadingMask.show()
},load:function(){this.loadingMask.hide()
},scope:this});
this.addEvents("crsSelected");
this.bbar=["->",{id:"crsSearchValidateButton",iconCls:"addIcon",disabled:true,text:translate("add"),handler:function(){this.buildCRSXmlList()
},scope:this}];
app.CRSSelectionPanel.superclass.initComponent.call(this)
},getCRS:function(){return new Ext.app.SearchField({id:"crsSearchField",width:240,store:app.CRS.crsStore,paramName:"name"})
},getLimitInput:function(){return{xtype:"textfield",name:"maxResults",id:"maxResults",value:50,width:40}
},getCRSTypeCombo:function(){var b=Ext.data.Record.create([{name:"id"}]);
app.CRS.crsTypeStore=new Ext.data.Store({url:"crs.types",reader:new Ext.data.XmlReader({record:"type"},b),fields:["id"]});
var a=new b({filename:translate("any")});
a.set("id","");
app.CRS.crsTypeStore.add(a);
app.CRS.crsTypeStore.load({add:true});
return{xtype:"combo",width:150,id:"search-crs",value:0,store:app.CRS.crsTypeStore,triggerAction:"all",mode:"local",displayField:"id",valueField:"id",listWidth:250,listeners:{select:function(f,c,d){app.CRS.crsStore.removeAll();
app.CRS.crsStore.baseParams.type=f.getValue();
var e=Ext.getCmp("crsSearchField").getValue();
if(e.length<1){app.CRS.crsStore.baseParams.name=""
}else{app.CRS.crsStore.baseParams.name=e
}app.CRS.crsStore.reload()
},clear:function(c){app.CRS.crsStore.load()
},scope:this}}
},getCRSItemSelector:function(){var a='<tpl for="."><div class="ux-mselect-item';
if(Ext.isIE||Ext.isIE7){a+='" unselectable=on'
}else{a+=' x-unselectable"'
}a+=">{description}</div></tpl>";
this.itemSelector=new Ext.ux.ItemSelector({name:"itemselector",fieldLabel:"ItemSelector",dataFields:["code","codeSpace","authority","description","version"],toData:[],msWidth:320,msHeight:230,valueField:"code",fromTpl:a,toTpl:a,toLegend:translate("selectedCRS"),fromLegend:translate("foundCRS"),fromStore:app.CRS.crsStore,fromAllowTrash:false,fromAllowDup:true,toAllowDup:false,drawUpIcon:false,drawDownIcon:false,drawTopIcon:false,drawBotIcon:false,imagePath:javascriptsLocation+"ext-ux/MultiselectItemSelector-3.0/icons",toTBar:[{text:translate("clear"),handler:function(){var b=this.getForm().findField("itemselector");
b.reset.call(b)
},scope:this}]});
this.itemSelector.on({change:function(b){Ext.getCmp("crsSearchValidateButton").setDisabled(b.toStore.getCount()<1)
}});
return this.itemSelector
},setRef:function(a){this.ref=a
},buildCRSXmlList:function(){this.crsSelected="";
var a=this.itemSelector.toMultiselect.store;
this.first=true;
a.each(function(b){var c="<gmd:referenceSystemInfo xmlns:gmd='http://www.isotc211.org/2005/gmd'  xmlns:gco='http://www.isotc211.org/2005/gco'><gmd:MD_ReferenceSystem><gmd:referenceSystemIdentifier><gmd:RS_Identifier><gmd:code><gco:CharacterString>"+b.data.description+"</gco:CharacterString></gmd:code><gmd:codeSpace><gco:CharacterString>"+b.data.codeSpace+"</gco:CharacterString></gmd:codeSpace><gmd:version><gco:CharacterString>"+b.data.version+"</gco:CharacterString></gmd:version></gmd:RS_Identifier></gmd:referenceSystemIdentifier></gmd:MD_ReferenceSystem></gmd:referenceSystemInfo>";
this.crsSelected+=(this.first?"":"&amp;&amp;&amp;")+c;
this.first=false
},this);
if(this.crsSelected!=""){this.fireEvent("crsSelected",this.crsSelected);
this.ownerCt.hide()
}}});Ext.namespace("app");
app.keyword={};
var Keyword=Ext.data.Record.create([{name:"value"},{name:"thesaurus",mapping:"thesaurus/key"},{name:"uri"}]);
app.keyword.keywordStore=new Ext.data.Store({proxy:new Ext.data.HttpProxy({url:"xml.search.keywords",method:"GET"}),baseParams:{pNewSearch:true,pTypeSearch:1,pThesauri:"",pMode:"searchBox"},reader:new Ext.data.XmlReader({record:"keyword",id:"uri"},Keyword),fields:["value","thesaurus","uri"],sortInfo:{field:"thesaurus"}});
app.KeywordSelectionPanel=Ext.extend(Ext.FormPanel,{border:false,itemSelector:null,loadingMask:null,ThesaurusCount:null,ref:null,keywordsSelected:[],initComponent:function(){this.items=[{xtype:"panel",layout:"fit",bodyStyle:"padding: 5px;",border:false,tbar:[this.getThesaurusCombo()," ",this.getKeyword(),"->",translate("maxResults")+" "+translate("perThesaurus"),this.getLimitInput()],items:[this.getKeywordsItemSelector()]}];
app.keyword.keywordStore.on({loadexception:function(){},beforeload:function(a,b){if(Ext.getCmp("maxResults")){a.baseParams.maxResults=Ext.getCmp("maxResults").getValue()
}if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(this.itemSelector.fromMultiselect.getEl(),{msg:translate("searching")})
}this.loadingMask.show()
},load:function(){this.loadingMask.hide()
},scope:this});
this.addEvents("keywordselected");
this.bbar=["->",{id:"keywordSearchValidateButton",iconCls:"addIcon",disabled:true,text:translate("add"),handler:function(){this.buildKeywordXmlList()
},scope:this}];
app.KeywordSelectionPanel.superclass.initComponent.call(this)
},getKeyword:function(){return new Ext.app.SearchField({id:"keywordSearchField",width:240,store:app.keyword.keywordStore,paramName:"pKeyword"})
},setRef:function(a){this.ref=a
},getLimitInput:function(){return{xtype:"textfield",name:"maxResults",id:"maxResults",value:50,width:40}
},getThesaurusCombo:function(){var b=Ext.data.Record.create([{name:"title"},{name:"value",mapping:"key"}]);
app.keyword.thesaurusStore=new Ext.data.Store({url:"xml.thesaurus.getList",reader:new Ext.data.XmlReader({record:"thesaurus"},b),fields:["title","id"]});
var a=new b({filename:translate("anyThesaurus")});
a.set("value","");
app.keyword.thesaurusStore.add(a);
app.keyword.thesaurusStore.load({add:true});
return{xtype:"combo",width:150,id:"search-thesauri",value:0,store:app.keyword.thesaurusStore,triggerAction:"all",mode:"local",displayField:"title",valueField:"value",listWidth:250,listeners:{select:function(f,c,d){app.keyword.keywordStore.removeAll();
app.keyword.keywordStore.baseParams.pThesauri=f.getValue();
var e=Ext.getCmp("keywordSearchField").getValue();
if(e.length<1){app.keyword.keywordStore.baseParams.pKeyword="*"
}else{app.keyword.keywordStore.baseParams.pKeyword=e
}app.keyword.keywordStore.reload()
},clear:function(c){app.keyword.keywordStore.load()
},scope:this}}
},getKeywordsItemSelector:function(){var a='<tpl for="."><div class="ux-mselect-item';
if(Ext.isIE||Ext.isIE7){a+='" unselectable=on'
}else{a+=' x-unselectable"'
}a+='>{id} {value} <span class="ux-mselect-item-thesaurus">({thesaurus})</span></div></tpl>';
this.itemSelector=new Ext.ux.ItemSelector({name:"itemselector",fieldLabel:"ItemSelector",dataFields:["value","thesaurus"],toData:[],msWidth:320,msHeight:230,valueField:"value",fromTpl:a,toTpl:a,toLegend:translate("selectedKeywords"),fromLegend:translate("foundKeywords"),fromStore:app.keyword.keywordStore,fromAllowTrash:false,fromAllowDup:true,toAllowDup:false,drawUpIcon:false,drawDownIcon:false,drawTopIcon:false,drawBotIcon:false,imagePath:javascriptsLocation+"ext-ux/MultiselectItemSelector-3.0/icons",toTBar:[{text:translate("clear"),handler:function(){var b=this.getForm().findField("itemselector");
b.reset.call(b)
},scope:this}]});
this.itemSelector.on({change:function(b){Ext.getCmp("keywordSearchValidateButton").setDisabled(b.toStore.getCount()<1)
}});
return this.itemSelector
},buildKeywordXmlList:function(){this.keywordsSelected=[];
var c=this;
this.ThesaurusCount=0;
var a=[];
var b=this.itemSelector.toMultiselect.store;
a=b.collect("thesaurus");
Ext.each(a,function(h,g,i){b.filter("thesaurus",h);
var f=b.collect("uri");
Ext.each(f,function(l,k){f[k]=l.replace("#","%23")
});
var j="xml.keyword.get";
var e=(f.length>1)?true:false;
var d=j+"?thesaurus="+h+"&id="+f.join(",")+"&multiple="+e;
++c.ThesaurusCount;
c.retrieveKeywordData(d)
});
b.clearFilter()
},retrieveKeywordData:function(a){Ext.getCmp("keywordSearchValidateButton").disable();
Ext.Ajax.request({url:a,method:"GET",scope:this,success:function(c){var b=c.responseText;
if(b.indexOf("<gmd:MD_Keywords")!==-1){this.keywordsSelected.push("<gmd:descriptiveKeywords xmlns:gmd='http://www.isotc211.org/2005/gmd'>"+c.responseText+"</gmd:descriptiveKeywords>")
}Ext.getCmp("keywordSearchValidateButton").enable();
this.ThesaurusCount-=1;
if(this.ThesaurusCount==0){this.fireEvent("keywordselected",this,this.keywordsSelected);
this.ownerCt.hide()
}}})
}});Ext.namespace("csiro");
csiro.SearchThesaurusSelectionPanel=null;
csiro.SearchCRSSelectionPanel=null;
csiro.SearchKeywordSelectionWindow=null;
csiro.showThesaurusSelectionPanel=function(d,b,c,a,e){var g=null;
if(b!=""){g=b
}csiro.SearchThesaurusSelectionPanel=new csiro.ThesaurusTermSelectionPanel({filterThesaurus:g,minSelected:1,maxSelected:1,listeners:{keywordselected:function(h,j){for(var i in j){if(j[i].uris.length>0){if(e!=""){$(e).value=i
}Ext.each(j[i].uris,function(l,k){$(a).value=l;
if(c!=""){$(c).value=j[i].terms[k]
}},this)
}}}}});
var f="Search Keywords";
csiro.SearchKeywordSelectionWindow=new Ext.Window({width:720,height:330,layout:"fit",title:f,items:csiro.SearchThesaurusSelectionPanel,closeAction:"hide",constrain:true,iconCls:"searchIcon"});
csiro.SearchKeywordSelectionWindow.show()
};
csiro.showCRSSelectionPanel=function(b,a){csiro.SearchCRSSelectionPanel=new csiro.CRSSelectionPanel({minSelected:1,maxSelected:1,listeners:{crsSelected:function(d,e){if(a){$(b).value=e.codes[0]
}else{$(b).value=e.descriptions[0]
}}}});
var c="Search Coordinate Reference Systems (CRS)";
csiro.SearchCRSSelectionWindow=new Ext.Window({width:720,height:330,layout:"fit",title:c,items:csiro.SearchCRSSelectionPanel,closeAction:"hide",constrain:true,iconCls:"searchIcon"});
csiro.SearchCRSSelectionWindow.show()
};
csiro.showRelatedDatasetSelectionPanel=function(d,e,b){var a=new app.LinkedMetadataSelectionPanel({ref:d,singleSelect:true,mode:name,listeners:{linkedmetadataselected:function(f,g){if(this.ref!=null){$(this.ref).value=g[0].data.uuid;
if(e!=null){$(e).value=b
}}}}});
var c=new Ext.Window({title:translate("linkedMetadataSelectionWindowTitle"),width:620,height:300,layout:"fit",items:a,closeAction:"hide",constrain:true,iconCls:"linkIcon",modal:true});
c.show()
};Ext.namespace("csiro");
csiro.keyword={};
csiro.Thesaurus=Ext.data.Record.create([{name:"title"},{name:"value",mapping:"key"}]);
var Keyword=Ext.data.Record.create([{name:"value"},{name:"thesaurus",mapping:"thesaurus/key"},{name:"uri"}]);
csiro.keyword.keywordStore=new Ext.data.Store({proxy:new Ext.data.HttpProxy({url:"xml.search.keywords",method:"GET"}),baseParams:{pNewSearch:true,pTypeSearch:1,pThesauri:"",pMode:"searchBox"},reader:new Ext.data.XmlReader({record:"keyword",id:"uri"},Keyword),fields:["value","thesaurus","uri"],sortInfo:{field:"thesaurus"}});
csiro.ThesaurusTermSelectionPanel=Ext.extend(Ext.FormPanel,{border:false,itemSelector:null,loadingMask:null,ThesaurusCount:null,minSelected:0,maxSelected:Number.MAX_VALUE,filterThesaurus:null,keywordsSelected:[],initComponent:function(){this.items=[{xtype:"panel",layout:"fit",bodyStyle:"padding: 5px;",border:false,tbar:[this.getThesaurusCombo()," ",this.getKeyword(),"->",translate("maxResults")+" "+translate("perThesaurus"),this.getLimitInput()],items:[this.getKeywordsItemSelector()]}];
csiro.keyword.keywordStore.on({loadexception:function(){},beforeload:function(a,b){if(Ext.getCmp("maxResults")){a.baseParams.maxResults=Ext.getCmp("maxResults").getValue()
}if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(this.itemSelector.getEl(),{msg:translate("searching")})
}this.loadingMask.show()
},load:function(){if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(this.itemSelector.getEl(),{msg:translate("searching")})
}this.loadingMask.hide()
},scope:this});
this.addEvents("keywordselected");
this.bbar=["->",{id:"keywordSearchValidateButton",iconCls:"addIcon",disabled:true,text:translate("add"),handler:function(){this.buildTermLists()
},scope:this}];
csiro.ThesaurusTermSelectionPanel.superclass.initComponent.call(this)
},getKeyword:function(){return new Ext.app.SearchField({id:"keywordSearchField",width:240,store:csiro.keyword.keywordStore,paramName:"pKeyword"})
},getLimitInput:function(){return{xtype:"textfield",name:"maxResults",id:"maxResults",value:50,width:40}
},getThesaurusCombo:function(){csiro.keyword.thesaurusStore=new Ext.data.Store({url:"xml.thesaurus.getList",reader:new Ext.data.XmlReader({record:"thesaurus"},csiro.Thesaurus),fields:["title","id"],autoLoad:false});
var a=new csiro.Thesaurus({filename:translate("anyThesaurus")});
a.set("value","");
csiro.keyword.thesaurusStore.add(a);
var b=new Ext.form.ComboBox({width:150,id:"search-thesauri",value:0,store:csiro.keyword.thesaurusStore,triggerAction:"all",mode:"local",displayField:"title",valueField:"value",listWidth:250,listeners:{select:function(f,c,d){csiro.keyword.keywordStore.removeAll();
csiro.keyword.keywordStore.baseParams.pThesauri=f.getValue();
var e="";
if(Ext.getCmp("keywordSearchField")){e=Ext.getCmp("keywordSearchField").getValue()
}if(e==null||e.length<1){csiro.keyword.keywordStore.baseParams.pKeyword="*"
}else{csiro.keyword.keywordStore.baseParams.pKeyword=e
}csiro.keyword.keywordStore.reload()
},clear:function(c){csiro.keyword.keywordStore.load()
},scope:this}});
csiro.keyword.thesaurusStore.on({load:function(){if(this.filterThesaurus!=null){var c=csiro.keyword.thesaurusStore.find("value",this.filterThesaurus,0,false,true);
if(c!=-1){b.setValue(this.filterThesaurus);
b.fireEvent("select",b,csiro.keyword.thesaurusStore.getAt(c),c)
}}},scope:this});
csiro.keyword.thesaurusStore.load({add:true});
return b
},getKeywordsItemSelector:function(){var a='<tpl for="."><div class="ux-mselect-item';
if(Ext.isIE||Ext.isIE7){a+='" unselectable=on'
}else{a+=' x-unselectable"'
}a+='>{id} {value} <span class="ux-mselect-item-thesaurus">({thesaurus})</span></div></tpl>';
this.itemSelector=new Ext.ux.Multiselect({store:csiro.keyword.keywordStore,dataFields:["value","thesaurus"],data:[],width:640,height:230,allowBlank:false,minLength:this.minSelected,maxLength:this.maxSelected,minLengthText:"Minimum {0} term(s) required",maxLengthText:"Maximum {0} term(s) allowed",displayField:"thesaurus",valueField:"value",name:"itemselector",fieldLabel:"ItemSelector",tpl:a,legend:translate("foundKeywords"),});
this.itemSelector.on({change:function(b){var c=b.view.getSelectedIndexes().length;
Ext.getCmp("keywordSearchValidateButton").setDisabled(c<this.minSelected&&c>this.maxSelected)
},scope:this});
return this.itemSelector
},buildTermLists:function(){this.keywordsSelected={};
var d=csiro.keyword.thesaurusStore.collect("value");
Ext.each(d,function(h,g,i){this.keywordsSelected[h]={uris:[],terms:[]}
},this);
var a=this.itemSelector.store;
var e=this.itemSelector.view.getSelectedIndexes();
for(var b=0;
b<e.length;
b++){var f=a.getAt(e[b]);
var c=f.get("thesaurus");
this.keywordsSelected[c].uris.push(f.get("uri").replace("#","%23"));
this.keywordsSelected[c].terms.push(f.get("value"))
}this.fireEvent("keywordselected",this,this.keywordsSelected);
this.ownerCt.hide()
}});Ext.namespace("csiro");
csiro.CRS={};
var CRS=Ext.data.Record.create([{name:"authority"},{name:"code"},{name:"version"},{name:"codeSpace"},{name:"description"}]);
csiro.CRS.crsStore=new Ext.data.Store({proxy:new Ext.data.HttpProxy({url:"crs.search",method:"GET"}),baseParams:{name:"",type:"",maxResults:50},reader:new Ext.data.XmlReader({record:"crs",id:"code"},CRS),fields:["code","codeSpace","authority","description","version"],sortInfo:{field:"description"}});
csiro.CRSSelectionPanel=Ext.extend(Ext.FormPanel,{border:false,itemSelector:null,loadingMask:null,crsCount:null,minSelected:0,maxSelected:Number.MAX_VALUE,crsSelected:[],initComponent:function(){this.items=[{xtype:"panel",layout:"fit",bodyStyle:"padding: 5px;",border:false,tbar:[this.getCRSTypeCombo()," ",this.getCRS(),"->",translate("maxResults"),this.getLimitInput()],items:[this.getCRSItemSelector()]}];
csiro.CRS.crsStore.on({loadexception:function(){},beforeload:function(a,b){if(Ext.getCmp("maxResults")){a.baseParams.maxResults=Ext.getCmp("maxResults").getValue()
}if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(this.itemSelector.getEl(),{msg:translate("searching")})
}this.loadingMask.show()
},load:function(){if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(this.itemSelector.getEl(),{msg:translate("searching")})
}this.loadingMask.hide()
},scope:this});
this.addEvents("crsSelected");
this.bbar=["->",{id:"crsSearchValidateButton",iconCls:"addIcon",disabled:true,text:translate("add"),handler:function(){this.buildCRSList()
},scope:this}];
csiro.CRSSelectionPanel.superclass.initComponent.call(this)
},getCRS:function(){return new Ext.app.SearchField({id:"crsSearchField",width:240,store:csiro.CRS.crsStore,paramName:"name"})
},getLimitInput:function(){return{xtype:"textfield",name:"maxResults",id:"maxResults",value:50,width:40}
},getCRSTypeCombo:function(){var b=Ext.data.Record.create([{name:"id"}]);
csiro.CRS.crsTypeStore=new Ext.data.Store({url:"crs.types",reader:new Ext.data.XmlReader({record:"type"},b),fields:["id"]});
var a=new b({filename:translate("any")});
a.set("id","");
csiro.CRS.crsTypeStore.add(a);
csiro.CRS.crsTypeStore.load({add:true});
return{xtype:"combo",width:150,id:"search-crs",value:0,store:csiro.CRS.crsTypeStore,triggerAction:"all",mode:"local",displayField:"id",valueField:"id",listWidth:250,listeners:{select:function(f,c,d){csiro.CRS.crsStore.removeAll();
csiro.CRS.crsStore.baseParams.type=f.getValue();
var e=Ext.getCmp("crsSearchField").getValue();
if(e.length<1){csiro.CRS.crsStore.baseParams.name=""
}else{csiro.CRS.crsStore.baseParams.name=e
}csiro.CRS.crsStore.reload()
},clear:function(c){csiro.CRS.crsStore.load()
},scope:this}}
},getCRSItemSelector:function(){var a='<tpl for="."><div class="ux-mselect-item';
if(Ext.isIE||Ext.isIE7){a+='" unselectable=on'
}else{a+=' x-unselectable"'
}a+=">{description}</div></tpl>";
this.itemSelector=new Ext.ux.Multiselect({store:csiro.CRS.crsStore,dataFields:["code","codeSpace","authority","description","version"],data:[],width:640,height:230,allowBlank:false,minLength:this.minSelected,maxLength:this.maxSelected,minLengthText:"Minimum {0} CRS(s) required",maxLengthText:"Maximum {0} CRS(s) allowed",displayField:"description",valueField:"code",name:"itemselector",fieldLabel:"ItemSelector",tpl:a,legend:translate("foundCRS"),});
this.itemSelector.on({change:function(b){var c=b.view.getSelectedIndexes().length;
Ext.getCmp("crsSearchValidateButton").setDisabled(c<this.minSelected&&c>this.maxSelected)
},scope:this});
return this.itemSelector
},buildCRSList:function(){this.crsSelected={descriptions:[],codes:[]};
var a=this.itemSelector.store;
var c=this.itemSelector.view.getSelectedIndexes();
for(var b=0;
b<c.length;
b++){var d=a.getAt(c[b]);
this.crsSelected.descriptions.push(d.get("description"));
this.crsSelected.codes.push(d.get("code"))
}this.fireEvent("crsSelected",this,this.crsSelected);
this.ownerCt.hide()
}});Ext.namespace("app");
app.Filter={SERVICE:[{name:"E_type",value:"service"}],DATASET:[{name:"[E_type",value:"dataset,series"}],FEATURE_CATALOGUE:[{name:"E__schema",value:"iso19110"}]};
app.Utility={convertSubjectAsCommaSeparatedValues:function(b,a){if(a.subject){return app.Utility.convertSeparatedValues(a.subject," ,")
}else{return""
}},convertSeparatedValues:function(b,d){var a="";
for(var c=0;
c<b.length;
c++){if(c!=0){a+=d
}a+=b[c].value
}return a
},checkUriNullValues:function(b,a){if(a.URI){return a.URI[0].value
}else{return""
}}};
app.linkedMetadata={};
app.linkedMetadata.linkedMetadataStore=new Ext.data.JsonStore({fields:[{name:"title",mapping:"title[0].value",defaultValue:""},{name:"subject",convert:app.Utility.convertSubjectAsCommaSeparatedValues,defaultValue:""},{name:"uuid",mapping:"identifier[0].value",defaultValue:""},{name:"uri",convert:app.Utility.checkUriNullValues}]});
app.LinkedMetadataSelectionPanel=Ext.extend(Ext.FormPanel,{border:false,layout:"fit",createIfNotExistURL:null,hiddenParameters:app.Filter.DATASET,singleSelect:true,loadingMask:null,ref:null,proxy:null,mode:null,serviceUrl:null,capabilitiesStore:null,initComponent:function(){this.addEvents("linkedmetadataselected");
if(this.mode=="attachService"||this.mode=="coupledResource"){this.capabilitiesStore=new GeoExt.data.WMSCapabilitiesStore({proxy:new Ext.data.HttpProxy({method:"GET",prettyUrls:false,url:this.proxy}),baseParams:{url:this.serviceUrl},id:"capabilitiesStore",listeners:{exception:function(g,h,i,e,f,d){Ext.MessageBox.alert(translate("error"))
},beforeload:function(){if(this.mode=="attachService"){var e=Ext.getCmp("linkedMetadataGrid").getSelectionModel().getSelections();
if(e==undefined||e[0].data.uri==""){Ext.MessageBox.alert(translate("NoServiceURLError"))
}var d;
this.capabilitiesStore.baseParams.url=e[0].data.uri+"?&SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1"
}else{if(this.mode=="coupledResource"){this.capabilitiesStore.baseParams.url=this.serviceUrl
}}},loadexception:function(){Ext.MessageBox.alert(translate("GetCapabilitiesDocumentError")+this.capabilitiesStore.baseParams.url)
},scope:this}})
}if(this.mode=="attachService"){this.hiddenParameters=app.Filter.SERVICE
}else{if(this.mode=="iso19110"){this.hiddenParameters=app.Filter.FEATURE_CATALOGUE
}}var b=new Ext.grid.CheckboxSelectionModel({singleSelect:this.singleSelect,header:"",listeners:{selectionchange:function(){Ext.getCmp("linkedMetadataValidateButton").setDisabled(this.getSelections().length<1)
}}});
var c=[this.getSearchInput(),"->",translate("maxResults"),this.getLimitInput()];
this.addHiddenFormInput(c);
var a=new Ext.grid.GridPanel({id:"linkedMetadataGrid",xtype:"grid",layout:"fit",height:280,bodyStyle:"padding: 0px;",border:true,loadMask:true,tbar:c,store:app.linkedMetadata.linkedMetadataStore,columns:[b,{id:"title",header:translate("mdTitle"),dataIndex:"title"},{id:"subject",header:translate("keywords"),dataIndex:"subject"},{id:"uri",header:translate("uri"),dataIndex:"uri"}],sm:b,autoExpandColumn:"title",listeners:{rowclick:function(d,g,f){if(this.capabilitiesStore!=null&&this.mode!="coupledResource"){this.serviceUrl=d.getStore().getAt(g).data.uri;
if(this.serviceUrl==""){this.capabilitiesStore.removeAll()
}else{this.capabilitiesStore.baseParams.url=this.serviceUrl;
this.capabilitiesStore.reload()
}}},scope:this}});
if(this.mode=="attachService"||this.mode=="coupledResource"){this.items=this.getScopedNamePanel(a)
}else{this.items=a
}this.bbar=["->",{id:"linkedMetadataValidateButton",iconCls:"linkIcon",text:translate("createRelation"),disabled:true,handler:function(){var d=a.getSelectionModel().getSelections();
this.fireEvent("linkedmetadataselected",this,d);
this.ownerCt.close()
},scope:this},this.getCreateIfNotExistButton()];
app.linkedMetadata.linkedMetadataStore.on({load:function(){if(this.loadingMask!=null){this.loadingMask.hide()
}},scope:this});
app.LinkedMetadataSelectionPanel.superclass.initComponent.call(this)
},getCreateIfNotExistButton:function(){if(this.createIfNotExistURL==null){return""
}return{id:"createIfNotExistButton",iconCls:"addIcon",text:translate("createIfNotExistButton"),handler:function(){window.location.replace(this.createIfNotExistURL)
},scope:this}
},setRef:function(a){this.ref=a
},addHiddenFormInput:function(a){for(var b=0;
b<this.hiddenParameters.length;
b++){a.push({xtype:"textfield",fieldLabel:this.hiddenParameters[b].name,name:this.hiddenParameters[b].name,value:this.hiddenParameters[b].value,hidden:true})
}return a
},getSearchInput:function(){return new Ext.app.SearchField({name:"E.8_AnyText",width:240,store:app.linkedMetadata.linkedMetadataStore,triggerAction:function(a){a.doSearch()
},scope:this})
},getLimitInput:function(){return{xtype:"textfield",name:"nbResultPerPage",id:"nbResultPerPage",value:20,width:40}
},getScopedNamePanel:function(c){var d={xtype:"combo",id:"getCapabilitiesLayerNameCombo",fieldLabel:translate("getCapabilitiesLayer"),store:this.capabilitiesStore,valueField:"name",displayField:"title",triggerAction:"all",listeners:{select:function(g,e,f){Ext.getCmp("getCapabilitiesLayerName").setValue(g.getValue())
}}};
var b={xtype:"textfield",id:"getCapabilitiesLayerName",fieldLabel:translate("layerName"),valueField:"name",displayField:"title"};
var a={xtype:"panel",layout:"form",bodyStyle:"padding: 2px;",border:true,items:[c,d,b]};
return a
},doSearch:function(){if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(this.getEl(),{msg:translate("searching")})
}this.loadingMask.show();
var a=Env.locService+"/csw";
app.nbResultPerPage=20;
if(Ext.getCmp("nbResultPerPage")){app.nbResultPerPage=Ext.getCmp("nbResultPerPage").getValue()
}CSWSearchTools.doCSWQueryFromForm(this.id,a,1,this.showResults,null,Ext.emptyFn)
},showResults:function(b){var d=new OpenLayers.Format.CSWGetRecords();
var c=d.read(b.responseText);
var a=c.records;
if(a!=undefined){app.linkedMetadata.linkedMetadataStore.loadData(a)
}}});Ext.namespace("GeoNetwork.editor");
GeoNetwork.editor.LogoSelectionPanel=Ext.extend(Ext.Panel,{defaultConfig:{autoScroll:true,autoWidth:true,layout:"border"},store:undefined,view:undefined,serviceUrl:undefined,logoAddUrl:"logo.add",ref:undefined,setRef:function(a){this.ref=a
},getUploadForm:function(){this.uploadForm=new Ext.FormPanel({fileUpload:true,region:"south",height:80,split:true,items:{xtype:"fileuploadfield",id:"form-file",allowBlank:false,emptyText:translate("logoSelect"),hideLabel:true,name:"fname"},buttons:[{text:translate("upload"),scope:this,handler:function(){if(this.uploadForm.getForm().isValid()){this.uploadForm.getForm().submit({url:this.logoAddUrl,scope:this,success:function(a,b){this.store.reload()
},failure:function(a){Ext.Msg.alert("Error",a.responseText)
}})
}}}]});
return this.uploadForm
},initComponent:function(b){Ext.apply(this,b);
Ext.applyIf(this,this.defaultConfig);
var a=new Ext.XTemplate('<tpl for="."><div class="logo-wrap"><div id="{name}" class="logo">','<img src="'+this.logoUrl+'{name}" title="{name}"/><span>{name}</span></div></div>',"</tpl>");
var c=Ext.data.Record.create([{name:"name",mapping:""}]);
this.store=new Ext.data.Store({autoDestroy:true,proxy:new Ext.data.HttpProxy({method:"GET",url:this.serviceUrl,disableCaching:false}),reader:new Ext.data.XmlReader({record:"icon",id:"icon"},c),fields:["name"]});
this.view=new Ext.DataView({store:this.store,tpl:a,singleSelect:true,selectedClass:"logo-selected",overClass:"logo-over",itemSelector:"div.logo-wrap",autoScroll:true,listeners:{selectionchange:function(e,f){var d=this.view.getSelectedIndexes();
if(f){this.fireEvent("logoselected",this,d);
this.ownerCt.hide()
}},scope:this}});
this.items=[new Ext.Panel({bbar:this.tb,region:"center",split:true,border:true,autoScroll:true,items:[this.view]}),this.getUploadForm()];
GeoNetwork.editor.LogoSelectionPanel.superclass.initComponent.call(this);
this.addEvents("logoselected");
this.store.load()
}});
Ext.reg("gn_editor_logoselectionpanel",GeoNetwork.editor.LogoSelectionPanel);Ext.namespace("GeoNetwork");
GeoNetwork.GeoPublisherPanel=Ext.extend(Ext.FormPanel,{border:false,itemSelector:null,geoserverStore:undefined,loadingMask:null,metadataId:null,fileName:null,layerName:null,accessStatus:null,nodeId:null,geoPublicationMap:null,geoPublicationMapPanel:null,geoPublicationTb:null,layers:null,extent:null,stylerBt:null,publishBt:null,unpublishBt:null,checkBt:null,addOnLineSourceBt:null,enableStyler:false,statusBar:null,layerPreviewName:"DatasetPreview",initComponent:function(){var b=Ext.data.Record.create([{name:"id"},{name:"name"},{name:"adminUrl"},{name:"wmsUrl"},{name:"wfsUrl"},{name:"stylerUrl"},{name:"namespacePrefix"}]);
this.geoserverStore=new Ext.data.Store({proxy:new Ext.data.HttpProxy({url:"geoserver.publisher?action=LIST",method:"GET"}),baseParams:{action:"LIST"},reader:new Ext.data.XmlReader({record:"node",id:"id"},b),sortInfo:{field:"name"}});
this.publishBt=new Ext.Button({text:translate("publish"),tooltip:translate("publishTooltip"),iconCls:"addVector",handler:function(){this.statusBar.setText("");
this.loadingMask.show();
Ext.Ajax.request({url:"geoserver.publisher",params:{metadataId:this.metadataId,nodeId:this.nodeId,file:this.fileName,access:this.accessStatus,action:"CREATE"},method:"GET",success:function(c,e){if(c.responseText.indexOf("OutOfMemoryError")!=-1){this.statusBar.setText(translate("publishError")+translate("publishErrorCode")+" OutOfMemoryError.");
this.loadingMask.hide();
return
}var d=c.responseXML.getElementsByTagName("Exception").item(0);
if(d!=null){this.statusBar.setText(translate("publishError")+translate("publishErrorCode")+d.getAttribute("status"));
this.loadingMask.hide();
return
}this.statusBar.setText(translate("publishSuccess"));
this.updatePrivileges(1);
this.addLayer(this.layerPreviewName,this.layerName);
this.statusBar.setText(this.statusBar.text+translate("publishLayerAdded"));
this.loadingMask.hide()
},failure:function(c,d){this.statusBar.setText(translate("publishError"));
this.loadingMask.hide()
},scope:this})
},scope:this});
this.unpublishBt=new Ext.Button({text:translate("unpublish"),tooltip:translate("unpublishTooltip"),iconCls:"delVector",handler:function(){this.statusBar.setText("");
this.cleanLayerPreview();
Ext.Ajax.request({url:"geoserver.publisher",params:{metadataId:this.metadataId,nodeId:this.nodeId,file:this.fileName,access:this.accessStatus,action:"DELETE"},method:"GET",success:function(c,d){this.statusBar.setText(translate("unpublishSuccess"));
this.updatePrivileges(0)
},failure:function(c,d){this.statusBar.setText(translate("unpublishError"))
},scope:this})
},scope:this});
this.checkBt=new Ext.Button({text:translate("check"),iconCls:"connect",listeners:{click:function(){this.statusBar.setText("");
Ext.Ajax.request({url:"geoserver.publisher",params:{metadataId:this.metadataId,nodeId:this.nodeId,file:this.fileName,access:this.accessStatus,action:"GET"},method:"GET",success:function(c,f){var e=c.responseXML.getElementsByTagName("Exception").item(0);
if(e!=null){var d=e.getAttribute("status");
this.statusBar.setText(translate("errorDatasetNotFound")+d);
if(d.indexOf("No vector layer")!=-1||d.indexOf("404")!=-1){this.updatePrivileges(0)
}else{this.updatePrivileges()
}return
}this.statusBar.setText(translate("datasetFound"));
this.updatePrivileges(1);
this.addLayer(this.layerPreviewName,this.layerName)
},failure:function(c,d){this.statusBar.setText(translate("checkFailure"));
this.updatePrivileges()
},scope:this})
},scope:this}});
this.addOnLineSourceBt=new Ext.Button({text:translate("addOnlineSource"),iconCls:"processMetadata",tooltip:"",handler:function(){var c=this.geoserverStore.getById(this.nodeId);
this.fireEvent("addOnLineSource",this,c.get("wmsUrl"),c.get("namespacePrefix")+":"+this.layerName,"")
},scope:this});
this.stylerBt=new Ext.Button({text:translate("Style"),iconCls:"styler",id:"stylerBt",tooltip:"",handler:function(){var d=this.geoserverStore.getById(this.nodeId);
var c=d.get("stylerUrl")+"?namespace="+d.get("namespacePrefix")+"&layer="+d.get("namespacePrefix")+":"+this.layerName;
window.open(c,"","toolbar=no,menubar=no,width=600,height=500")
},scope:this});
this.geoPublicationTb=new Ext.Toolbar({items:[this.getGeoserverCombo(),this.checkBt,this.publishBt,this.unpublishBt,this.addOnLineSourceBt,this.stylerBt]});
this.statusBar=new Ext.form.Label({id:"statusBar",html:translate("statusInformation")});
var a=new Ext.Toolbar({items:[this.statusBar]});
this.geoserverStore.load({add:false});
this.tbar=this.geoPublicationTb;
this.bbar=a;
this.items=this.getGeoPublicationMapPanel();
this.addEvents("addOnLineSource");
GeoNetwork.GeoPublisherPanel.superclass.initComponent.call(this);
this.on("resize",function(e,c,d){e.geoPublicationMapPanel.setSize(c,d)
});
if(!this.loadingMask){this.loadingMask=new Ext.LoadMask(Ext.getBody(),{msg:translate("publishing")})
}},getGeoPublicationMapPanel:function(){var d=new OpenLayers.Map();
var c=[];
for(var b=0;
b<backgroundLayers.length;
b++){var a=new OpenLayers.Layer.WMS(backgroundLayers[b][0],backgroundLayers[b][1],backgroundLayers[b][2],backgroundLayers[b][3]);
d.addLayer(a)
}return this.geoPublicationMapPanel=new GeoExt.MapPanel({id:"mapPanel",extent:this.extent,map:d,width:this.width,height:this.height})
},addLayer:function(d,a){var c=Ext.getCmp("mapPanel").map;
this.cleanLayerPreview();
var b=new OpenLayers.Layer.WMS(d,this.geoserverStore.getById(this.nodeId).get("wmsUrl"),{transparent:"true",layers:a});
c.addLayer(b)
},cleanLayerPreview:function(){var b=Ext.getCmp("mapPanel").map;
var a=b.getLayersByName(this.layerPreviewName);
if(a.length>0){a[0].destroy()
}},getGeoserverCombo:function(){return{xtype:"combo",tpl:'<tpl for="."><div ext:qtip="{name}. {adminUrl}" class="x-combo-list-item">{name}</div></tpl>',store:this.geoserverStore,displayField:"name",autoSelect:true,forceSelection:true,mode:"local",triggerAction:"all",emptyText:translate("selectANode"),id:"geoserverNode",listeners:{select:function(c,a,b){this.nodeId=a.get("id");
this.cleanLayerPreview();
this.enableStyler=(a.get("stylerUrl")==""?false:true);
this.checkBt.fireEvent("click")
},scope:this}}
},setRef:function(c,b,a){this.metadataId=c;
this.fileName=b;
if(this.fileName.indexOf("jdbc")!=-1){this.layerName=this.fileName.substr(this.fileName.indexOf("#")+1,this.fileName.length)
}else{this.layerName=this.fileName.substr(0,this.fileName.indexOf("."))
}this.accessStatus=a;
this.cleanLayerPreview();
this.updatePrivileges();
if(this.nodeId!=null){this.checkBt.fireEvent("click")
}},updatePrivileges:function(a){if(this.nodeId==null){this.checkBt.disable()
}else{this.checkBt.enable()
}this.publishBt.disable();
this.unpublishBt.disable();
this.addOnLineSourceBt.disable();
this.stylerBt.disable();
switch(a){case 0:this.publishBt.enable();
break;
case 1:this.publishBt.enable();
this.unpublishBt.enable();
this.addOnLineSourceBt.enable();
if(this.fileName.indexOf("tif")!=-1||!this.enableStyler){this.stylerBt.disable()
}else{this.stylerBt.enable()
}break
}}});
Ext.reg("gn_geopublihserpanel",GeoNetwork.GeoPublisherPanel);Ext.namespace("app");
Ext.app.SearchField=Ext.extend(Ext.form.TwinTriggerField,{initComponent:function(){if(!this.store.baseParams){this.store.baseParams={}
}Ext.app.SearchField.superclass.initComponent.call(this);
this.on("specialkey",function(a,b){if(b.getKey()==b.ENTER){this.onTrigger2Click()
}},this)
},validationEvent:false,validateOnBlur:false,trigger1Class:"x-form-clear-trigger",trigger2Class:"x-form-search-trigger",hideTrigger1:true,width:180,hasSearch:false,paramName:"query",onTrigger1Click:function(){if(this.hasSearch){this.store.baseParams[this.paramName]="";
this.store.removeAll();
this.el.dom.value="";
this.triggers[0].hide();
this.hasSearch=false;
this.focus();
var a=Ext.get("conf");
if(a){a.enableDisplayMode().show()
}}},onTrigger2Click:function(){var a=this.getRawValue();
if(a.length<1){this.store.baseParams[this.paramName]="*"
}else{this.store.baseParams[this.paramName]=a
}if(this.triggerAction){this.triggerAction(this.scope,a)
}else{this.store.reload()
}this.hasSearch=true;
this.triggers[0].show();
this.focus();
var b=Ext.get("conf");
if(b){b.enableDisplayMode().hide()
}}});var CSWSearchTools={cswMethod:"POST",resultsMode:"results",doCSWQueryFromForm:function(g,b,f,e,c,h){var d=CSWSearchTools.buildCSWQueryFromForm(CSWSearchTools.cswMethod,Ext.getCmp(g),f,app.sortBy,h);
if(CSWSearchTools.cswMethod=="POST"){var a=CSWSearchTools.buildCSWQueryFromForm("GET",Ext.getCmp(g),f,app.sortBy,h);
OpenLayers.Request.POST({url:b,data:d,success:function(i){e(i,a)
},failure:c})
}else{OpenLayers.Request.GET({url:b,params:d,success:function(i){e(i,d)
},failure:c})
}},buildCSWQueryFromForm:function(h,e,b,g,f){var a=CSWSearchTools.getFormValues(e);
var d=[];
CSWSearchTools.addFiltersFromPropertyMap(a,d);
f(a,d);
if(d.length==0){d.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LIKE,property:"anyText",value:".*"}))
}var c=new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.AND,filters:d});
if(h=="POST"){return CSWSearchTools.buildCSWQueryPOST(c,b,g)
}else{return CSWSearchTools.buildCSWQueryGET(c,b,g)
}},addFiltersFromPropertyMap:function(b,e){var a=".8";
var c=b.E_similarity;
if(c!=null){a=b.E_similarity;
CSWSearchTools.addFilter(e,"E_similarity",a,a)
}for(var d in b){var f=b[d];
if(f!=""&&d!="E_similarity"){CSWSearchTools.addFilter(e,d,f,a)
}}},addFilter:function(e,d,f,a){var h=d.match("^(\\[?)([^_]+)_(.*)$");
if(h){if(h[1]=="["){var g=[];
var b=f.split(",");
for(var c=0;
c<b.length;
++c){CSWSearchTools.addFilterImpl(b.length>1?g:e,h[2],h[3],b[c],a)
}if(b.length>1){e.push(new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.OR,filters:g}))
}}else{CSWSearchTools.addFilterImpl(e,h[2],h[3],f,a)
}}},addFilterImpl:function(e,d,b,f,a){if(d=="S"){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LIKE,property:b,value:f+".*"}))
}else{if(d=="C"){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LIKE,property:b,value:".*"+f+".*"}))
}else{if(d.charAt(0)=="E"){if(d.length>1){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:"similarity",value:d.substring(1)}))
}e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:b,value:f}));
if(d.length>1){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:"similarity",value:a}))
}}else{if(d==">="){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,property:b,value:f}))
}else{if(d=="<="){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,property:b,value:f}))
}else{if(d=="T"){var h=f.split(" ");
for(var c=0;
c<h.length;
++c){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:b,value:h[c]}))
}}else{if(d=="B"){e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:b,value:f?1:0}))
}else{if(d=="V"){var g=f.match("^([^/]+)/(.*)$");
e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:"similarity",value:"1.0"}));
e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:g[1],value:g[2]}));
e.push(new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:"similarity",value:a}))
}else{alert("Cannot parse "+d)
}}}}}}}}},sortByMappings:{relevance:{name:"relevance",order:"D"},rating:{name:"rating",order:"D"},popularity:{name:"popularity",order:"D"},date:{name:"date",order:"D"},title:{name:"title",order:"A"}},buildCSWQueryPOST:function(d,b,f){var a='<?xml version="1.0" encoding="UTF-8"?>\n<csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="'+this.resultsMode+'" startPosition="'+b+'" maxRecords="'+app.nbResultPerPage+'">\n  <csw:Query typeNames="csw:Record">\n    <csw:ElementSetName>full</csw:ElementSetName>\n';
if(f){var e=CSWSearchTools.sortByMappings[f];
a+='    <ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc">\n      <ogc:SortProperty>\n        <ogc:PropertyName>'+e.name+"</ogc:PropertyName>\n        <ogc:SortOrder>"+e.order+"</ogc:SortOrder>\n      </ogc:SortProperty>\n    </ogc:SortBy>\n"
}if(d){var c=new OpenLayers.Format.XML().write(new OpenLayers.Format.Filter().write(d));
c=c.replace(/^<\?xml[^?]*\?>/,"");
a+='    <csw:Constraint version="1.0.0">\n';
a+=c;
a+="    </csw:Constraint>\n"
}a+="  </csw:Query>\n</csw:GetRecords>";
return a
},buildCSWQueryGET:function(d,b,f){var a={request:"GetRecords",service:"CSW",version:"2.0.2",resultType:this.resultsMode,namespace:"csw:http://www.opengis.net/cat/csw/2.0.2",typeNames:"csw:Record",constraintLanguage:"FILTER",constraint_language_version:"1.1.0",elementSetName:"full",startPosition:b,maxRecords:app.nbResultPerPage};
if(f){var e=CSWSearchTools.sortByMappings[f];
a.sortBy=e.name+":"+e.order
}if(d){var c=new OpenLayers.Format.XML().write(new OpenLayers.Format.Filter().write(d));
c=c.replace(/^<\?xml[^?]*\?>/,"");
a.constraint=c
}return a
},getFormValues:function(b){var a=b.getForm().getValues()||{};
b.cascade(function(d){if(d.disabled!=true){if(d.isXType("boxselect")){if(d.getValue&&d.getValue()){a[d.getName()]=d.getValue()
}}else{if(d.isXType("combo")){if(d.getValue&&d.getValue()){a[d.getName()]=d.getValue()
}}else{if(d.isXType("fieldset")){if(d.checkbox){a[d.checkboxName]=!d.collapsed
}}else{if(d.isXType("radiogroup")){var c=d.items.get(0);
a[c.getName()]=c.getGroupValue()
}else{if(d.isXType("checkbox")){a[d.getName()]=d.getValue()
}else{if(d.isXType("datefield")){if(d.getValue()!=""){a[d.getName()]=d.getValue().format("Y-m-d")+(d.postfix?d.postfix:"")
}}else{if(d.getName){if(d.getValue&&d.getValue()!=""){a[d.getName()]=d.getValue()
}}}}}}}}}return true
});
return a
}};var getGNServiceURL=function(a){if(a.indexOf("/")==0){return Env.locService+a
}else{return Env.locService+"/"+a
}};
function findPos(c){var b=0;
if(c){var a=c.cumulativeOffset();
b=a[1]
}return b
}var Checks={message:translate("loseYourChange"),_setMessage:function(a){this.message=a
},_onbeforeunload:function(a){if(opener){editRed=opener.$$(".editing");
if(editRed&&editRed.length>0){editRed.invoke("removeClassName","editing")
}a.returnValue=this.message
}}};
function unloadMess(){mess=translate("loseYourChange");
return mess
}var bfu=Checks._onbeforeunload.bindAsEventListener(Checks);
function setBunload(a){if(a){Event.observe(window,"beforeunload",bfu);
Checks._setMessage(unloadMess())
}else{Event.stopObserving(window,"beforeunload",bfu);
Checks._setMessage(null)
}}function doEditorLoadActions(){setBunload(true);
var a=new Ext.KeyMap(document,[{key:"s",ctrl:true,shift:true,fn:function(){$("btnSave").onclick()
}},{key:"q",ctrl:true,shift:true,fn:function(){$("btnSaveAndClose").onclick()
}},{key:"v",ctrl:true,shift:true,fn:function(){$("btnValidate").onclick()
}},{key:"t",ctrl:true,shift:true,fn:function(){$("btnThumbnails").onclick()
}},{key:"r",ctrl:true,shift:true,fn:function(){$("btnReset").onclick()
}},{key:"c",ctrl:true,shift:true,fn:function(){$("btnCancel").onclick()
}},{key:112,fn:function(){displayBox(null,"shortcutHelp",true)
}}]);
a.enable()
}Event.observe(window,"load",doEditorLoadActions);
Ajax.Responders.register({onCreate:function(){if(Ajax.activeRequestCount===1){var a=$("editorBusy");
if(a){a.show()
}}},onComplete:function(){if(Ajax.activeRequestCount===0){var a=$("editorBusy");
if(a){a.hide()
}}}});
function doAction(a){setBunload(false);
document.mainForm.action=a;
goSubmit("mainForm")
}function doTabAction(b,a){disableEditForm();
document.mainForm.currTab.value=a;
doAction(b)
}function getControlsFromElement(a){var b=a.getAttribute("id");
elButtons=$("buttons_"+b);
return elButtons.immediateDescendants()
}function topElement(a){if(a.previous()==undefined){return true
}else{return(!isSameElement(a.previous(),a))
}}function bottomElement(a){if(a.next()==undefined){return true
}else{return(!isSameElement(a.next(),a))
}}function getIdSplit(a){var b=a.getAttribute("id");
if(b==null){return null
}return b.split("_")
}function orElement(b){if(b.next()==undefined){return false
}else{var a=getIdSplit(b.next());
var c=getIdSplit(b);
if(a==null||c==null){return false
}if(a[0]=="child"&&a[1]==c[0]){return true
}else{return false
}}}function isSameElement(b,a){var d=getIdSplit(b);
var c=getIdSplit(a);
if(d==null||c==null){return false
}if(d[0]==c[0]){return true
}else{return false
}}function topControls(c,b){var d=getControlsFromElement(c);
var a=0;
if(d.length==5){a=1
}if(bottomElement(c)&&!orElement(c)){d[0].show()
}else{d[0].hide()
}if(a==1){if(bottomElement(c)&&!orElement(c)){d[a].show()
}else{d[a].hide()
}}if(bottomElement(c)){if(b==0){d[1+a].show()
}else{d[1+a].hide()
}}else{d[1+a].show()
}d[2+a].hide();
if(bottomElement(c)){d[3+a].hide()
}else{d[3+a].show()
}}function doRemoveAttributeAction(d,c,e){var f=document.mainForm.id.value;
var b=$(c+"_block");
var a=Ext.Ajax.request({url:getGNServiceURL(d),method:"GET",params:{id:f,ref:c},success:function(g,j){var h=g.responseText;
doSaveAction("metadata.update");
setBunload(true)
},failure:function(g,h){Ext.MessageBox.alert(translate("errorDeleteAttribute")+name+" "+translate("errorFromDoc")+" / status "+g.status+" text: "+g.statusText+" - "+translate("tryAgain"));
setBunload(true)
}})
}function doRemoveElementAction(f,e,c,b,g){var h=document.mainForm.id.value;
var d=$(b);
var j=d.next();
var k=d.previous();
var a=Ext.Ajax.request({url:getGNServiceURL(f),method:"GET",params:{id:h,ref:e,parent:c},success:function(l,n){var m=l.responseText;
if(m.blank()){if(bottomElement(d)&&document.mainForm.currTab.value!="simple"){swapControls(d,k);
d.remove();
d=k
}else{d.remove();
d=j
}if(topElement(d)){topControls(d,g)
}}else{if(orElement(d)){d.remove()
}else{d.replace(m)
}}setBunload(true)
},failure:function(l,m){Ext.MessageBox.alert(translate("errorDeleteElement")+name+" "+translate("errorFromDoc")+" / status "+l.status+" text: "+l.statusText+" - "+translate("tryAgain"));
setBunload(true)
}})
}function swapControls(e,d){var b=getControlsFromElement(e);
var a=getControlsFromElement(d);
for(var c=0;
c<b.length;
++c){var g=b[c].visible();
var f=a[c].visible();
if(g){a[c].show()
}else{a[c].hide()
}if(f){b[c].show()
}else{b[c].hide()
}}}function doMoveElementAction(e,c,g){var f=document.mainForm.id.value;
var a="&id="+f+"&ref="+c;
var b=$(g);
var d=new Ajax.Request(getGNServiceURL(e),{method:"get",parameters:a,onSuccess:function(k){if(k.status==0){alert("Browser returned status 0 - Element has been moved but we didn't get the right response - please 'Save' record")
}if(e.include("elem.up")){var h=b.previous();
h=h.remove();
b.insert({after:h});
swapControls(b,h)
}else{var j=b.next();
j=j.remove();
b.insert({before:j});
swapControls(b,j)
}setBunload(true)
},onFailure:function(h){alert(translate("errorMoveElement")+c+" / status "+h.status+" text: "+h.statusText+" - "+translate("tryAgain"));
setBunload(true)
}});
setBunload(true)
}function doNewElementAction(e,d,b,h,f,a){var g=null;
var c=false;
doNewElementAjax(e,d,b,g,h,f,a,c)
}function doNewAttributeAction(e,d,b,h,f){var g="geonet:attribute";
var a=null;
var c=false;
doNewElementAjax(e,d,b,g,h,f,a,c)
}function doNewORElementAction(e,d,b,h,g,f,a){var c=true;
doNewElementAjax(e,d,b,h,g,f,a,c)
}function setAddControls(e,d){elDescs=getControlsFromElement(e);
var a=0;
if(elDescs.length==5){a=1
}if(d){elDescs[0].hide()
}else{elDescs[0].show()
}if(a==1){if(d){elDescs[a].hide()
}else{elDescs[a].show()
}}elDescs[1+a].show();
elDescs[2+a].show();
elDescs[3+a].hide();
if(topElement(e)){elDescs[2+a].hide()
}else{var c=e.previous();
var f=getControlsFromElement(c);
var b=0;
if(f.length==5){b=1
}f[0].hide();
if(b==1){f[b].hide()
}f[1+b].show();
if(topElement(c)){f[2+b].hide()
}else{f[2+b].show()
}f[3+b].show()
}}function doNewElementAjax(h,g,b,e,c,m,l,k){var j=document.mainForm.id.value;
var f="&id="+j+"&ref="+g+"&name="+b;
if(e!=null){f+="&child="+e
}var d=$(c);
var a=new Ajax.Request(getGNServiceURL(h),{method:"get",parameters:f,onSuccess:function(o){if(o.status==0){alert("Got back status 0 - element has been added but we didn't receive the response - 'Save' record now")
}var n=o.responseText;
if(e=="geonet:attribute"){doSaveAction("metadata.update");
return
}if(m=="replace"){d.replace(n)
}else{if(m=="add"||m=="after"){d.insert({after:n});
setAddControls(d.next(),k)
}else{if(m=="before"){d.insert({before:n});
setAddControls(d.previous(),k)
}else{alert("doNewElementAjax: invalid what: "+m+" should be one of replace, after or before.")
}}}if(b=="gmd:geographicElement"||b=="gmd:polygon"){extentMap.initMapDiv()
}initCalendar();
validateMetadataFields();
setBunload(true)
},onFailure:function(n){alert(translate("errorAddElement")+b+translate("errorFromDoc")+" / status "+n.status+" text: "+n.statusText+" - "+translate("tryAgain"));
setBunload(true)
}})
}function disableEditForm(){var a=new Element("div",{id:"editorOverlay"});
$("editFormTable").insert({top:a});
$("editorOverlay").setStyle({opacity:"0.65"})
}function doSaveAction(e,c){disableEditForm();
if(typeof c!="undefined"){document.mainForm.showvalidationerrors.value="true"
}else{document.mainForm.showvalidationerrors.value="false"
}var f=document.mainForm.id.value;
var b=null;
if(e.include("finish")){var d=new Ajax.Request(getGNServiceURL(e),{method:"post",parameters:$("editForm").serialize(true),onSuccess:function(h){if(h.status==0){alert("Save succeeded but browser returned status 0")
}var g=h.responseText;
if(b){b.removeClassName("editing")
}if(g.startsWith("<?xml")<0){alert(translate("errorSaveFailed")+g)
}setBunload(false);
location.replace(getGNServiceURL("metadata.show?id="+f+"&skipPopularity=y"))
},onFailure:function(g){alert(translate("errorSaveFailed")+"/ status "+g.status+" text: "+g.statusText+" - "+translate("tryAgain"));
Element.remove($("editorOverlay"));
setBunload(true)
}})
}else{var a=Ext.getCmp("validationReportBox");
if(a){a.destroy()
}var d=new Ajax.Updater({success:document.body},getGNServiceURL(e),{method:"post",parameters:$("editForm").serialize(true),evalScripts:true,onComplete:function(g){if(g.status==200){if(document.mainForm.showvalidationerrors.value=="true"){getValidationReport()
}setBunload(true);
initCalendar();
validateMetadataFields()
}else{alert("Status returned was "+g.status+" this could be a problem")
}},onFailure:function(g){alert(translate("errorSaveFailed")+"/ status "+g.status+" text: "+g.statusText+" - "+translate("tryAgain"));
Element.remove($("editorOverlay"));
setBunload(true)
}})
}}function doCancelAction(b,a){if(confirm(a)){doSaveAction(b);
return true
}return false
}function cancelCreation(b,a){if(confirm(a)){window.location=b;
return true
}}function doConfirm(b,a){if(confirm(a)){doAction(b);
return true
}return false
}function doEditorAlert(a,b){$(a).style.display="block";
setBunload(true)
}function checkForFileUpload(f,l){var k=$("s_"+l);
var g=$("_"+l);
var d=k.value;
var c=g.value;
var h=new RegExp("^WWW:DOWNLOAD-.*-http--download.*");
var b=(h.test(d));
var e=(h.test(c));
var j=$("_"+f);
var a=(j!=null&&j.value.length>0);
if(a){if(e&&!b){alert(translate("errorChangeProtocol"));
k.value=g.value
}else{g.value=k.value
}return
}finput=$("di_"+f);
fbuttn=$("db_"+f);
if(b){if(finput!=null){finput.hide()
}if(fbuttn!=null){fbuttn.show()
}}else{if(finput!=null){finput.show()
}if(fbuttn!=null){fbuttn.hide()
}}g.value=k.value
}function startFileUpload(b,a){Modalbox.show(getGNServiceURL("resources.prepare.upload")+"?ref="+a+"&id="+b,{title:translate("insertFileMode"),height:200,width:600})
}function doFileUploadSubmit(b){setBunload(false);
var d=$("fileUploadForm");
var a=d.ref;
var c=d["f_"+$F(a)];
var e=$F(c);
if(e==""){alert(translate("selectOneFileUpload"));
return false
}AIM.submit(b,{onComplete:function(g){if(g.body==null){alert(translate("uploadFailed")+g)
}else{$("uploadresponse").innerHTML=g.body.innerHTML
}var h=$("filename_uploaded");
if(h!=null){var f=$("_"+$F(a));
if(f!=null){f.value=h.getAttribute("title");
$("di_"+$F(a)).show();
$("db_"+$F(a)).hide();
Modalbox.show(g.body.innerHTML,{width:600,afterHide:function(){doSaveAction("metadata.update")
}})
}else{alert(translate("uploadSetFileNameFailed"))
}}}})
}function doFileRemoveAction(c,b,a,e){var d=findPos($(e));
setBunload(false);
document.mainForm.access.value=a;
document.mainForm.ref.value=b;
document.mainForm.position.value=d;
document.mainForm.action=c;
goSubmit("mainForm")
}function handleCheckboxAsBoolean(a,b){if(a.checked){$(b).value="true"
}else{$(b).value="false"
}}function setRegion(m,j,h,a,k,g,r){var c=k.value;
var p="";
var f="";
var q="";
var b="";
if(c!=undefined&&c!=""){coords=c.split(",");
p=coords[0];
f=coords[1];
q=coords[2];
b=coords[3];
$("_"+m).value=p;
$("_"+j).value=f;
$("_"+h).value=q;
$("_"+a).value=b;
if($("_"+r)!=null){$("_"+r).value=k.text
}}else{$("_"+m).value="";
$("_"+j).value="";
$("_"+h).value="";
$("_"+a).value=""
}var l=Ext.DomQuery.select(".extentViewer");
for(var o=0;
o<l.length;
++o){var d=l[o];
if(g==d.getAttribute("elt_ref")){extentMap.updateBboxForRegion(extentMap.maps[g],m+","+h+","+j+","+a,g,true)
}}}function clearRef(b){setBunload(false);
var a="_"+b+"_cal";
$(a).clear();
setBunload(true)
}var lastclick=0;
function noDoubleClick(){var a=(new Date()).valueOf();
if((a-lastclick)>500){setBunload(false);
lastclick=a;
return true
}else{return false
}}function buildDuration(a){if($("Y"+a).value==""){$("Y"+a).value=0
}if($("M"+a).value==""){$("M"+a).value=0
}if($("D"+a).value==""){$("D"+a).value=0
}if($("H"+a).value==""){$("H"+a).value=0
}if($("MI"+a).value==""){$("MI"+a).value=0
}if($("S"+a).value==""){$("S"+a).value=0
}$("_"+a).value=($("N"+a).checked?"-":"")+"P"+$("Y"+a).value+"Y"+$("M"+a).value+"M"+$("D"+a).value+"DT"+$("H"+a).value+"H"+$("MI"+a).value+"M"+$("S"+a).value+"S"
}function validateNumber(d,f,b){var g=d.value;
var a="0123456789";
if(!f){if(!validateNonEmpty(d)){return false
}}if(b){a+="."
}var e=true;
var h;
for(i=0;
i<g.length&&e;
i++){h=g.charAt(i);
if(h=="-"||h=="+"){if(i<0){e=false
}}else{if(a.indexOf(h)==-1){e=false
}}}if(!e){d.addClassName("error");
return false
}else{d.removeClassName("error");
return true
}}function validateNonEmpty(a){if(a.value.length<1){a.addClassName("error");
return false
}else{a.removeClassName("error");
return true
}}function validateEmail(a){if(!isEmail(a.value)){a.addClassName("error");
return false
}else{a.removeClassName("error");
return true
}}function validateMetadataFields(){$$("select.lang_selector").each(function(a){for(i=0;
i<a.options.length;
i++){if(a.options[i].getAttribute("code").toLowerCase()==Env.lang){a.options[i].selected=true
}}enableLocalInput(a,false)
});
$$("input,textarea,select").each(function(a){validateMetadataField(a)
})
}function initCalendar(){var e=Ext.DomQuery.select("div.cal");
for(var c=0;
c<e.length;
c++){var a=e[c];
var b=a.id;
a.id=b+"Id";
if(a.firstChild==null||a.childNodes.length==1){var f="Y-m-d";
var d=Ext.getDom(b+"_format");
if(d){f=d.value
}var h=Ext.getDom(b+"_cal");
var g="";
if(h){g=Ext.getDom(b+"_cal").value
}var j=(f.indexOf("T")==-1?false:true);
if(j){new Ext.ux.form.DateTime({renderTo:a.id,name:b,id:b,value:g,dateFormat:"Y-m-d",timeFormat:"H:i",dateAltFormats:null,timeAltFormats:null,hiddenFormat:"Y-m-d\\TH:i:s",dtSeparator:"T"})
}else{new Ext.form.DateField({renderTo:a,name:b,id:b,width:160,value:g,format:"Y-m-d",altFormats:null,beforeBlur:function(){},setValue:function(k){if(!(k instanceof Date)&&this.formatDate(this.parseDate(k))!==k){Ext.form.DateField.superclass.setValue.call(this,k)
}else{Ext.form.DateField.superclass.setValue.call(this,this.formatDate(this.parseDate(k)))
}}})
}}}}var logoSelectionWindow;
function showLogoSelectionPanel(a){if(!logoSelectionWindow){var b=new GeoNetwork.editor.LogoSelectionPanel({ref:a,serviceUrl:"xml.harvesting.info?type=icons",logoUrl:Env.host+Env.url+"/images/harvesting/",listeners:{logoselected:function(e,c){var d=e.store.getAt(c);
Ext.getDom(e.ref).value=e.logoUrl+d.get("name")
}}});
logoSelectionWindow=new Ext.Window({title:translate("logoSelectionWindow"),width:300,height:300,layout:"fit",items:b,closeAction:"hide",constrain:true,iconCls:"attached"})
}logoSelectionWindow.items.get(0).setRef(a);
logoSelectionWindow.show()
}var keywordSelectionWindow;
function showKeywordSelectionPanel(c,a){if(!keywordSelectionWindow){var b=new app.KeywordSelectionPanel({listeners:{keywordselected:function(d,g){var k="_X"+this.ref+"_"+a.replace(":","COLON");
var f;
var j=true;
Ext.each(g,function(m,l){g[l]=m.replace('<?xml version="1.0" encoding="UTF-8"?>',"").replace(/\"/g,"&quot;").replace(/\r\n/g,"");
if(j){f=g[l];
j=false
}else{f+="&amp;&amp;&amp;"+g[l]
}});
var e={tag:"input",type:"hidden",id:k,name:k,value:f};
var h=Ext.DomHelper;
h.append(Ext.get("hiddenFormElements"),e);
doAction("metadata.update")
}}});
keywordSelectionWindow=new Ext.Window({title:translate("keywordSelectionWindowTitle"),width:620,height:300,layout:"fit",items:b,closeAction:"hide",constrain:true,iconCls:"searchIcon"})
}keywordSelectionWindow.items.get(0).setRef(c);
keywordSelectionWindow.show()
}var searchKeywordSelectionWindow;
function showSearchKeywordSelectionPanel(){if(!searchKeywordSelectionWindow){var a=new app.KeywordSelectionPanel({listeners:{keywordselected:function(b,d){var c;
var e=true;
Ext.each(d,function(j,f){c=d[f];
var k;
if(window.ActiveXObject){var k=new ActiveXObject("Microsoft.XMLDOM");
k.async="false";
k.loadXML(c)
}else{var k=new DOMParser().parseFromString(c,"text/xml")
}var h=k.getElementsByTagName("gmd:keyword");
var g;
Ext.each(h,function(n,l){var m=h[l].childNodes[1].childNodes[0].nodeValue;
addKeyword(m,e);
e=false
})
})
}}});
searchKeywordSelectionWindow=new Ext.Window({width:620,height:300,title:translate("keywordSelectionWindowTitle"),layout:"fit",items:a,closeAction:"hide",constrain:true,iconCls:"searchIcon"})
}searchKeywordSelectionWindow.show()
}function addKeyword(a,b){a='"'+a+'"';
if(b){$("themekey").value=""
}if($("themekey").value!=""){$("themekey").value+=" or "+a
}else{$("themekey").value=a
}}function doSaveThen(a){new Ajax.Request(getGNServiceURL("metadata.update"),{method:"post",parameters:$("editForm").serialize(true),onSuccess:function(b){location.replace(getGNServiceURL(a))
},onFailure:function(b){alert(translate("errorSaveFailed")+"/ status "+b.status+" text: "+b.statusText+" - "+translate("tryAgain"));
Element.remove($("editorOverlay"));
setBunload(true)
}})
}function showLinkedMetadataSelectionPanel(d,c){var e=((c=="uuidref"||c=="iso19110"||c=="")?true:false);
var a=new app.LinkedMetadataSelectionPanel({ref:d,singleSelect:e,mode:c,listeners:{linkedmetadataselected:function(h,l){if(e){if(this.ref!=null){$("_"+this.ref+(c!=""?"_"+c:"")).value=l[0].data.uuid
}else{if(this.mode=="iso19110"){var j="xml.relation.insert?parentId="+document.mainForm.id.value+"&childUuid="+l[0].data.uuid;
var k=$("editorBusy");
if(k){k.show()
}disableEditForm();
var g=Ext.Ajax.request({url:j,method:"GET",success:function(o,q){var p=o.responseText;
doSaveThen("metadata.processing?uuidref="+l[0].data.uuid+"&id="+document.mainForm.id.value+"&process=update-attachFeatureCatalogue")
},failure:function(o,p){Ext.MessageBox.alert(translate("error")+" / status "+o.status+" text: "+o.statusText+" - "+translate("tryAgain"));
Element.remove($("editorOverlay"));
if(k){k.hide()
}setBunload(true)
}})
}}}else{var f=[];
var n=l.length>1?true:false;
Ext.each(l,function(p,o){if(n){c=c+"_"+o
}f.push({tag:"input",type:"hidden",id:c,name:c,value:p.data.uuid})
});
var m=Ext.DomHelper;
m.append(Ext.get("hiddenFormElements"),f)
}}}});
var b=new Ext.Window({title:translate("linkedMetadataSelectionWindowTitle"),width:620,height:300,layout:"fit",items:a,closeAction:"hide",constrain:true,iconCls:"linkIcon",modal:true});
b.show()
}function detachFeatureCatalogueMd(e,c,d){var b="xml.relation.delete?parentUuid="+e+"&childUuid="+c;
var a=Ext.Ajax.request({url:b,method:"GET",success:function(f,h){var g=f.responseText;
window.location.replace("metadata.processing?uuidref="+c+"&id="+d+"&process=update-detachFeatureCatalogue")
},failure:function(f,g){Ext.MessageBox.alert(translate("error")+" / status "+f.status+" text: "+f.statusText+" - "+translate("tryAgain"));
setBunload(true)
}})
}var geoPublisherWindow;
function showGeoPublisherPanel(g,a,d,f,e,b){Ext.QuickTips.init();
if(geoPublisherWindow&&geoPublisherWindow.getEl().dom.parentNode==null){geoPublisherWindow.close();
geoPublisherWindow=undefined
}if(!geoPublisherWindow){var c=new GeoNetwork.GeoPublisherPanel({width:650,height:300,layers:backgroundLayers,extent:b,listeners:{addOnLineSource:function(h,l,k,m){var p="_X"+e+"_"+f.replace(":","COLON");
var o="<gmd:CI_OnlineResource xmlns:gmd=&quot;http://www.isotc211.org/2005/gmd&quot; xmlns:gco=&quot;http://www.isotc211.org/2005/gco&quot;><gmd:linkage><gmd:URL>"+l+"</gmd:URL></gmd:linkage><gmd:protocol><gco:CharacterString>OGC:WMS-1.1.1-http-get-map</gco:CharacterString></gmd:protocol><gmd:name gco:nilReason=&quot;missing&quot;><gco:CharacterString>"+k+"</gco:CharacterString></gmd:name><gmd:description><gco:CharacterString>"+k+"</gco:CharacterString></gmd:description></gmd:CI_OnlineResource>";
var j={tag:"input",type:"hidden",id:p,name:p,value:o};
var n=Ext.DomHelper;
n.append(Ext.get("hiddenFormElements"),j);
doAction("metadata.update")
}}});
geoPublisherWindow=new Ext.Window({title:translate("geoPublisherWindowTitle"),layout:"fit",modal:true,items:c,closeAction:"hide",constrain:true,iconCls:"repository"})
}geoPublisherWindow.items.get(0).setRef(g,a,d);
geoPublisherWindow.setTitle(translate("geoPublisherWindowTitle")+" "+a);
geoPublisherWindow.show()
}function showLinkedServiceMetadataSelectionPanel(c,e,d){var a=new app.LinkedMetadataSelectionPanel({mode:c,autoWidth:true,ref:null,proxy:Env.proxy,serviceUrl:e,region:"north",uuid:d,createIfNotExistURL:"metadata.create.form?type="+(c=="attachService"?"service":"dataset"),singleSelect:true,listeners:{linkedmetadataselected:function(h,l){var j=Ext.getCmp("getCapabilitiesLayerName").getValue();
if(c=="attachService"){var g="xml.metadata.processing?uuid="+l[0].data.uuid+"&process=update-srv-attachDataset&uuidref="+d+"&scopedName="+j;
var k=$("editorBusy");
if(k){k.show()
}disableEditForm();
Ext.Ajax.request({url:g,method:"GET",success:function(m,o){var n=m.responseText;
if(n.indexOf("Not owner")!=-1){alert(translate("NotOwnerError"))
}else{if(n.indexOf("error")!=-1){alert(translate("error")+n)
}}doSaveThen("metadata.processing?uuid="+d+"&process=update-onlineSrc&desc="+j+"&url="+escape(l[0].data.uri)+"&scopedName="+j)
},failure:function(m,n){if(k){k.hide()
}Element.remove($("editorOverlay"));
Ext.MessageBox.alert(translate("ServiceUpdateError"));
setBunload(true)
}})
}else{var f="xml.metadata.processing?uuid="+l[0].data.uuid+"&process=update-onlineSrc&desc="+j+"&url="+e+"&scopedName="+j;
Ext.Ajax.request({url:f,method:"GET",success:function(m,o){var n=m.responseText;
if(n.indexOf("Not owner")!=-1){alert(translate("NotOwnerError"))
}else{if(n.indexOf("error")!=-1){alert(translate("error")+n)
}}window.location.replace("metadata.processing?uuid="+d+"&process=update-srv-attachDataset&uuidref="+l[0].data.uuid+"&scopedName="+j)
},failure:function(m,n){Ext.MessageBox.alert(translate("ServiceUpdateError"));
setBunload(true)
}})
}},scope:this}});
var b=new Ext.Window({title:(c=="attachService"?translate("associateService"):translate("associateDataset")),layout:"fit",width:620,height:400,items:a,closeAction:"hide",constrain:true,iconCls:"linkIcon",modal:true});
b.show()
}var crsSelectionWindow;
function showCRSSelectionPanel(c,a){if(!crsSelectionWindow){var b=new app.CRSSelectionPanel({listeners:{crsSelected:function(e){var g="_X"+c+"_"+a.replace(":","COLON");
var d={tag:"input",type:"hidden",id:g,name:g,value:e};
var f=Ext.DomHelper;
f.append(Ext.get("hiddenFormElements"),d);
doAction("metadata.update")
}}});
crsSelectionWindow=new Ext.Window({title:translate("crsSelectionWindowTitle"),layout:"fit",width:620,height:300,items:b,closeAction:"hide",constrain:true,iconCls:"searchIcon"})
}crsSelectionWindow.items.get(0).setRef(c);
crsSelectionWindow.show()
}function validateMetadataField(a){var b=a.getAttribute("onchange");
var c=a.getAttribute("onkeyup");
if(typeof(b)=="function"){b=b.toString()
}if(typeof(c)=="function"){c=c.toString()
}if(!a||(b!=null&&b.indexOf("validate")==-1)||(c!=null&&c.indexOf("validate")==-1)){return
}if(a.onkeyup){a.onkeyup()
}if(a.onchange){a.onchange()
}}function enableLocalInput(f,b){var e=f.value;
var d=f.parentNode.parentNode;
var c=d.getElementsByTagName("input");
var a=d.getElementsByTagName("textarea");
show(c,e,b);
show(a,e,b)
}function clearSuggestion(a){if($(a)!=null){$(a).innerHTML=""
}}function show(c,d,a){for(index in c){var b=c[index];
if(b.style!=null&&b.style.display!="none"){b.style.display="none"
}}for(index in c){var b=c[index];
if(b.name==d){b.style.display="block";
if(a){b.focus()
}}}}function googleTranslate(b,a,e,f,d){var c={GE:"de",SP:"es",CH:"zh"};
if(c[f]){f=c[f]
}if(c[d]){d=c[d]
}if($(b).value==""){alert(translate("translateWithGoogle.emptyInput"));
return
}if($(b).value.length>5000){alert(translate("translateWithGoogle.maxSize"));
return
}if($(a)!=null){$(a).innerHTML=""
}google.language.translate($(b).value,f,d,function(g){if(!g.error){var h=g.translation.replace(/&#39;/g,"'").replace(/&quot;/g,'"');
if($(e)!=null){$(e).value=h
}if($(a)!=null){$(a).innerHTML=h;
$(a).style.display="block"
}}else{alert(g.error.message+" ("+g.error.code+")")
}validateMetadataField($(e))
})
}function updateUpperCardinality(b,c){var a=b+"_isInfinite";
if(c=="0"||c=="1"){$(b).value=c;
$(a).value="false"
}else{if(c=="n"){$(b).value="";
$(a).value="true"
}else{$(b).value="";
$(a).value="false"
}}}function updateValidationReportVisibilityRules(a){$("validationReport").descendants().each(function(b){if(b.nodeName=="SPAN"){errors=$(b).next().descendants().filter(function(c){return(c.nodeName=="LI"&&c.getAttribute("name")=="error")
});
if(errors.length==0&&a){b.style.display="none"
}else{b.style.display="block"
}}else{if(b.nodeName=="LI"){if(b.getAttribute("name")=="pass"&&a){b.style.display="none"
}else{b.style.display="block"
}}}})
}function getValidationReport(){var d=document.mainForm.id.value;
var a="&id="+d;
var c="metadata.validate";
var b=new Ajax.Request(getGNServiceURL(c),{method:"get",parameters:a,onSuccess:function(f){if(f.status==0){alert("Browser returned status 0 and validation report has been lost - try again?");
getValidationReport()
}var e=f.responseText;
displayBox(e,"validationReport",false);
updateValidationReportVisibilityRules($("checkError").checked);
setBunload(true)
},onFailure:function(e){alert(translate("errorOnAction")+c+" / status "+e.status+" text: "+e.statusText+" - "+translate("tryAgain"));
$("editorBusy").hide();
setBunload(true)
}})
}function computeExtentFromKeywords(a){window.location.replace("metadata.processing?id="+document.mainForm.id.value+"&process=add-extent-from-geokeywords&url="+Env.host+Env.locService+"&gurl="+Env.host+Env.url+"&lang="+Env.lang+"&replace="+a)
};var getGNServiceURL=function(a){if(a.indexOf("/")==0){return Env.locService+a
}else{return Env.locService+"/"+a
}};
function setAll(c){var b=$(c).getElementsByTagName("input");
for(var a=0;
a<b.length;
a++){b[a].checked=true
}}function clearAll(c){var b=$(c).getElementsByTagName("input");
for(var a=0;
a<b.length;
a++){b[a].checked=false
}}function radioModalUpdate(h,a,g,f){var d="";
var b=$(h).getElementsBySelector('input[type="hidden"],textarea,select');
b.each(function(i){d+="&"+i.name+"="+i.value
});
var c=$(h).getElementsBySelector('input[type="radio"]');
c.each(function(i){if(i.checked){d+="&"+i.name+"="+i.value
}});
if(g!=null&&g){a=getGNServiceURL(a)+"?"+d;
Modalbox.show(a,{title:f,width:600})
}else{var e=new Ajax.Request(getGNServiceURL(a),{method:"get",parameters:d,onSuccess:function(){},onFailure:function(i){alert(translate("error")+a+" / status "+i.status+" text: "+i.statusText+" - "+translate("tryAgain"))
}});
window.Modalbox.hide()
}}function checkBoxModalUpdate(g,a,f,e){var c=$(g).getElementsBySelector('input[type="checkbox"]');
var b="&id="+$("metadataid").value;
c.each(function(h){if(h.checked){b+="&"+h.name+"=on"
}});
if(f!=null&&f){a=getGNServiceURL(a)+"?"+b;
Modalbox.show(a,{title:e,width:600})
}else{var d=new Ajax.Request(getGNServiceURL(a),{method:"get",parameters:b,onSuccess:function(){},onFailure:function(h){alert(translate("error")+a+" / status "+h.status+" text: "+h.statusText+" - "+translate("tryAgain"))
}});
window.Modalbox.hide()
}}function checkCreate(a,b){descs=$("groups").getValue();
if(descs.length==0){alert(translate("userAtLeastOneGroup"));
return false
}return true
}function doConfirmDelete(a,c,d,f,e){if(confirm(c+" ("+d+")")){var b;
if(opener){b=opener.$(f)
}else{b=$(f)
}if(b){b.hide()
}Modalbox.show(a,{title:e,width:600,afterHide:function(){if($("simple_search_pnl")&&$("simple_search_pnl").visible()){runSimpleSearch()
}else{if($("advanced_search_pnl")&&$("advanced_search_pnl").visible()){runAdvancedSearch()
}else{if($("metadata_search_pnl")&&$("metadata_search_pnl").visible()){location.replace(getGNServiceURL("main.search")+"?hitsPerPage=10&editable=true")
}else{location.replace(getGNServiceURL("home"))
}}}runRssSearch()
}});
return true
}return false
}function doOtherButton(b,d,c,a){if(a===undefined){a=400
}Modalbox.show(b,{title:d,width:c,height:a});
return true
}function doEdit(a,b){load(a)
}function doAction(a){document.mainForm.action=a;
goSubmit("mainForm")
}function doTabAction(b,a){document.mainForm.currTab.value=a;
doAction(b)
}function setBunload(a){}function runFileDownload(a,b){if(a.include("resources.get")){location.replace(getGNServiceURL(a))
}else{Modalbox.show(getGNServiceURL(a),{title:b,height:400,width:600})
}}function runFileDownloadSummary(a,c){pars="&uuid="+a;
var b=new Ajax.Request(getGNServiceURL("prepare.file.download"),{method:"get",parameters:pars,onSuccess:function(d){Modalbox.show(d.responseText,{title:c,height:400,width:600})
},onFailure:function(d){alert(translate("error")+" "+getGNServiceURL("prepare.file.download")+" failed: status "+d.status+" text: "+d.statusText+" - "+translate("tryAgain"))
}})
}function batchUpdateChildren(a,d,c){var b=getGNServiceURL(a);
Modalbox.show(b,{title:d,width:c})
}function updateChildren(f,a,e){var c="&id="+$("id").value+"&parentUuid="+$("parentUuid").value+"&schema="+$("schema").value+"&childrenIds="+$("childrenIds").value;
var b=$(f).getElementsBySelector('input[type="checkbox"]');
b.each(function(g){if(g.checked){c+="&"+g.name+"=true"
}});
var d=$(f).getElementsBySelector('input[type="radio"]');
d.each(function(g){if(g.checked){c+="&"+g.name+"="+g.value
}});
Ext.Ajax.request({url:Env.locService+"/"+a,method:"GET",params:c,success:function(g,j){var i=g.responseXML;
if(i.childNodes.length!=0&&i.childNodes[0].localName=="response"){var h=i.childNodes[0].childNodes[0].nodeValue;
alert(h);
window.Modalbox.hide()
}else{alert(e)
}},failure:function(g,h){alert(e)
}})
};function toolTip(e){elem=$(e);
if(elem.childElements().length==0){var h=elem.getAttribute("id").split("|");
var g=h[0].substring(5);
var b=h[1];
var d=h[2];
var a=h[3];
var c=h[4];
var f=str.substitute(toolTipRequestTemp,{SCHEMA:g,NAME:b,CONTEXT:d,FULLCONTEXT:a,ISOTYPE:c});
ker.send("xml.schema.info",f,ker.wrap(this,function(i){var j="";
tip=document.createElement("div");
tip.className="toolTipOverlay";
if(i.nodeName=="error"){j=translate("cannotGetTooltip")
}else{j=getHtmlTip(i.getElementsByTagName("element")[0])
}tip.innerHTML=j;
elem.appendChild(tip)
}))
}else{childs=elem.childElements();
childs[0].toggle()
}}function getHtmlTip(c){var d=c.getAttribute("error");
if(d!=null){var j=toolTipErrorTemp;
var a="ERROR : "+d;
var f={ERROR:a};
return str.substitute(toolTipErrorTemp,f)
}else{var j=toolTipTemp;
var i=xml.evalXPath(c,"label");
var g=xml.evalXPath(c,"description");
var h=xml.evalXPath(c,"condition");
var e=xml.evalXPath(c,"help");
var b=xml.evalXPath(c,"help_link");
if(h==null){h=""
}if(e==null){e=""
}if(b!=null){var f={LABEL:i,DESCRIPTION:g,HELP_LINK:b,CONDITION:h,HELP:e};
return str.substitute(toolTipTempLink,f)
}else{var f={LABEL:i,DESCRIPTION:g,CONDITION:h,HELP:e};
return str.substitute(toolTipTemp,f)
}}}var toolTipRequestTemp='<request>   <element schema="{SCHEMA}" name="{NAME}" context="{CONTEXT}" fullContext="{FULLCONTEXT}" isoType="{ISOTYPE}"/></request>';
var toolTipTemp='   <b>{LABEL}</b>   <br/>   <span class="tooltipDescription">{DESCRIPTION}</span>   <br/>   <font color="#C00000">{CONDITION}</font>   <i>{HELP}</i>';
var toolTipTempLink=toolTipTemp+'   <br/>   <a href="{HELP_LINK}" target="_blank">'+translate("helpLinkTooltip")+"</a>";
var toolTipErrorTemp='   <font color="#C00000">{ERROR}</font>';function Tooltip(k,d){var p=k;
var e=d;
var o=false;
var q=false;
var n=null;
var a=null;
var f=1000;
Event.observe(e,"mouseover",ker.wrap(this,m));
Event.observe(e,"mouseout",ker.wrap(this,g));
function m(s){if(o){return
}var r=Event.pointerX(s)+12;
var t=Event.pointerY(s)+12;
if(n==null){c(r,t)
}else{n.style.left=r;
n.style.top=t;
a=setTimeout(ker.wrap(this,j),f)
}}function j(){Element.show(n);
o=true;
a=null
}function g(r){q=true;
if(a){clearTimeout(a);
a=null
}if(!o){return
}Element.hide(n);
o=false
}function c(B,A){var s=e.getAttribute("id");
var z=s.substring(4).split("|");
var u=z[0];
var r=z[1];
var t=z[2];
var w=z[3];
var v=str.substitute(l,{SCHEMA:u,NAME:r,CONTEXT:t,ISOTYPE:w});
q=false;
ker.send("xml.schema.info",v,ker.wrap(this,function(x){if(x.nodeName=="error"){ker.showError(p.getText("cannotGet"),x)
}else{var y=b(x.getElementsByTagName("element")[0]);
n=document.createElement("div");
n.className="tooltip";
n.innerHTML=y;
n.style.display="none";
n.style.zIndex=32000;
document.body.appendChild(n);
n.style.left=B;
n.style.top=A;
if(!q){a=setTimeout(ker.wrap(this,j),300)
}}}))
}function b(s){var t=s.getAttribute("error");
if(t!=null){var z=h;
var r=p.getText("error")+" : "+t;
var v={ERROR:r};
return str.substitute(h,v)
}else{var z=i;
var y=xml.evalXPath(s,"label");
var w=xml.evalXPath(s,"description");
var x=xml.evalXPath(s,"condition");
var u=xml.evalXPath(s,"help");
if(x==null){x=""
}if(u==null){u=""
}var v={LABEL:y,DESCRIPTION:w,CONDITION:x,HELP:u};
return str.substitute(i,v)
}}var l='<request>   <element schema="{SCHEMA}" name="{NAME}" context="{CONTEXT}" isoType="{ISOTYPE}"/></request>';
var i='   <b>{LABEL}</b>   <br>   {DESCRIPTION}   <br>   <font color="#C00000">{CONDITION}</font>   <i>{HELP}</i>';
var h='   <font color="#C00000">{ERROR}</font>'
};var tipMan=null;
function init(){tipMan=new TooltipManager();
ker.loadMan.wait(tipMan)
}function TooltipManager(){var a=new XMLLoader(Env.locUrl+"/xml/editor.xml");
this.init=b;
function b(){var d=document.getElementsByTagName("SPAN");
for(var c=0;
c<d.length;
c++){var e=d[c].getAttribute("id");
if(e!=null){if(e.startsWith("tip.")){new Tooltip(a,d[c])
}}}}};