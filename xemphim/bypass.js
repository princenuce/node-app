var mE={gA:function(a,b){a.splice(0,b)},
s4:function(a,b){var c=a[0];a[0]=a[b%a.length];a[b]=c},
kn:function(a){a.reverse()}};
bypass=function(a,b){a=a.split("");mE.gA(a,3);mE.kn(a,7);mE.s4(a,43);return a.join("")};

module.exports = bypass;