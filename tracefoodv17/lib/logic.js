
const namespace = "org.turnkeyledger.tracefood";

/**
* Track the trade of a commodity from one trader to another
* @param {org.turnkeyledger.tracefood.MakeCrate} crateDetails - the trade to be processed
* @transaction
*/
async function makeCrate (crateDetails) {
   
    let factory = await getFactory();
    var NS = 'org.turnkeyledger.tracefood';
    var me = getCurrentParticipant();

    const crateReg = await getAssetRegistry(namespace + '.Crate');
  
  	var newCrate = factory.newResource(NS, 'Crate', crateDetails.crate.crateId);
  
  	newCrate = crateDetails.crate;
  	newCrate.supplier = me;
  
	return getAssetRegistry(namespace + '.Crate')
    .then(function (assetRegistry) {
        return assetRegistry.add(newCrate);
  });
}

  /**
 * Track the trade of a commodity from one trader to another
 * @param {org.turnkeyledger.tracefood.AddTraceCrate} traceData - the trade to be processed
 * @transaction
 */
async function AddTraceCrate (traceData) {
  	
  	let crateId = traceData.crateId;
    
    let factory = await getFactory();
    var NS = 'org.turnkeyledger.tracefood';
    // var me = getCurrentParticipant();

    const crateReg = await getAssetRegistry(namespace + '.Crate');
 
    var crate = await crateReg.get(crateId);
	
    var newTrace = factory.newConcept(NS, 'Trace');
    newTrace.timestamp = new Date();
	newTrace.action = traceData.action;
  
  	if(traceData.location != null) {
    	newTrace.location = traceData.location;
    }
  	if(traceData.description != null) {
    	newTrace.location = traceData.location;
    }
  	if(traceData.campanyInvolved != null) {
    	newTrace.campanyInvolved = traceData.campanyInvolved;
    }

  	let  concepts = [];
  
  	concepts = crate.trace;

  	concepts.push(newTrace);

  	crate.trace = concepts;
    

    return getAssetRegistry(namespace + '.Crate')
    .then(function (assetRegistry) {
        return assetRegistry.update(crate);
  });
 }

  /**
 * Track the trade of a commodity from one trader to another
 * @param {org.turnkeyledger.tracefood.MakeOrder} orderData - the trade to be processed
 * @transaction
 */
async function MakeOrder (orderData) {
  // console.log(orderData.order);
  var factory = getFactory();
  var me = getCurrentParticipant();
  const orderReg = await getAssetRegistry(namespace + '.Order');
  const crateReg = await getAssetRegistry(namespace + '.Crate');
  var order = factory.newResource(namespace, 'Order', orderData.order.orderId);
  order = orderData.order;
  console.log('wtf');
  order.supplier = me;
  var newTrace = factory.newConcept(namespace, 'Trace');
    newTrace.timestamp = new Date();
  	
  	if (orderData.address != null) {
    newTrace.location = orderData.address ;
    } else {
     newTrace.location = me.address;
    }
  	let  concepts = [];

  	concepts.push(newTrace);

  	order.traces = concepts;
  
  return getAssetRegistry('org.turnkeyledger.tracefood.Order')
        .then(function (assetRegistry) {
            return assetRegistry.add(orderData.order);
        }).then(function(){
            return getAssetRegistry('org.turnkeyledger.tracefood.Crate')
        })
        .then(function (assetRegistry) {
            return assetRegistry.updateAll(order.crates);
        });
   
  
 }

/**
     * Associate the Packcase to order
     * @param {org.turnkeyledger.tracefood.Acto} tx - the tx to be processed
     * @transaction
**/
function Acto(tx){
   if(tx.order.crates == null) {
        tx.order.crates  = []; // initialise
    }
  let  crates = [];
  crates.push(tx.crate);
  tx.order.crates.push(tx.crate);
  tx.crate.order = tx.order
  console.log(tx.order);
 return getAssetRegistry(namespace + '.Order')
    .then(function (assetRegistry) {
        return assetRegistry.update(tx.order);
  }).then(function(){
            return getAssetRegistry('org.turnkeyledger.tracefood.Crate')
        })
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.crate);
        });
   
}

/**
     * Associate the Packcase to order
     * @param {org.turnkeyledger.tracefood.Actom} tx - the tx to be processed
     * @transaction
**/
function Actom(tx){
 
   if(tx.order.crates == null) {
        tx.order.crates  = []; // initialise
    }
  let  crates = [];
  crates = tx.crates;
    crates.forEach(function(item) {
   item.order = tx.order;
      item.restaurant = tx.order.restaurant;
       tx.order.crates.push(item);
     });
 
  
 return getAssetRegistry(namespace + '.Order')
    .then(function (assetRegistry) {
        return assetRegistry.update(tx.order);
  }).then(function(){
            return getAssetRegistry('org.turnkeyledger.tracefood.Crate')
        })
        .then(function (assetRegistry) {
            return assetRegistry.updateAll(crates);
        });
   
}

 /**
 * Track the trade of a commodity from one trader to another
 * @param {org.turnkeyledger.tracefood.AddTraceOrder} traceData - the trade to be processed
 * @transaction
 */
async function AddTraceOrder (traceData) {
  	
  	let orderId = traceData.orderId;
    
    let factory = await getFactory();
    var NS = 'org.turnkeyledger.tracefood';
    // var me = getCurrentParticipant();

    const orderReg = await getAssetRegistry(namespace + '.Order');
 
    var order = await orderReg.get(orderId);
  	
    var newTrace = factory.newConcept(NS, 'Trace');
    newTrace.timestamp = new Date();
	newTrace.action = traceData.action;
  
  	if(traceData.location != null) {
    	newTrace.location = traceData.location;
    }
  	if(traceData.description != null) {
    	newTrace.location = traceData.location;
    }
  	if(traceData.campanyInvolved != null) {
    	newTrace.campanyInvolved = traceData.campanyInvolved;
    }
  console.log(newTrace);

  	let  concepts = [];
  
  	if(order.traces == null) {
    order.traces = [];
    }
  
  	concepts = order.traces;

  	concepts.push(newTrace);

  	order.traces = concepts;
    

    return getAssetRegistry(namespace + '.Order')
    .then(function (assetRegistry) {
        return assetRegistry.update(order);
  });
 }

/**
     * Associate the Packcase to order
     * @param {org.turnkeyledger.tracefood.ConfirmOrder} tx - the tx to be processed
     * @transaction
**/
async function ConfirmOrder(tx){
    let orderId = tx.orderId;
    
    let factory = await getFactory();
    var NS = 'org.turnkeyledger.tracefood';
    var me = getCurrentParticipant();
    const orderReg = await getAssetRegistry(namespace + '.Order');
  	var order = await orderReg.get(orderId);
  	console.log(order);
  
  	if(order.restaurant.getIdentifier() == me.getIdentifier() && order.orderStatus == 'DELIVERED') {
    console.log('yes');
    } else { console.log('no');}
      
}

/**
     * Associate the Packcase to order
     * @param {org.turnkeyledger.tracefood.UpdateOrderState} tx - the tx to be processed
     * @transaction
**/
async function UpdateOrderState(tx) {
    let orderId = tx.orderId;
    let status = tx.orderStatus;
    let factory = await getFactory();
    var NS = 'org.turnkeyledger.tracefood';
    var me = getCurrentParticipant();
    const orderReg = await getAssetRegistry(namespace + '.Order');
  	var order = await orderReg.get(orderId);
  	console.log(order);
  	if(me.getIdentifier() == order.supplier.getIdentifier()) { 
      console.log('supplier confirmed');
  	if(order.orderStatus != 'DELIVERED' && order.orderStatus != 'CONFIRMED' && status != 'CONFIRMED') { 
    	order.orderStatus = status;
      return getAssetRegistry(namespace + '.Order')
    	.then(function (assetRegistry) {
        return assetRegistry.update(order);
	});}
	
    } else if (me.getIdentifier() == order.restaurant.getIdentifier()) {
      console.log('restaurant confirmed');
    	if (order.orderStatus == 'DELIVERED') {
          console.log('DELIVERED');
        	order.orderStatus = status;
      return getAssetRegistry(namespace + '.Order')
    	.then(function (assetRegistry) {
        return assetRegistry.update(order);
  });
        }
    }
     else { console.log('nope');}
  	

}

