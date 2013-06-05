(function($) {
  
  $.fn.dataAttrSearch = function(attribute,searchBtn,clearBtn,status) {
    var config = {}
    var $timer
    var $common = 'the, it is, we, all, a, an, by, to, you, me, he, do, she, they, we, how, it, i, are, to, for, of'
    if (attribute){
      var dataAttr = attribute.replace('data-','')
    }
    else {
      var dataAttr = 'tags'
    }
    this.each(function() { 
        var $box = $(this)
        $box.wrap('<div/>')
        var $wrap = $box.parent()
        if (searchBtn == true){
          $wrap.append(_submitButton($box))
        }
        if (clearBtn == true){
          $wrap.append(_clearButton($box))
        }
        if (status == true){
          $wrap.append('<p style="display:none" class="searchStatus">Search Returned <span class="resultCount"></span> out of '+$('[data-'+dataAttr+']').length+'</p>')
        }
        $box.on('keyup',function(){
          var $self = $(this)
          window.clearTimeout($timer)
          $timer = window.setTimeout(function(){_search($self.val())},100)
        })
        $box.on('blur',function(){
          var $self = $(this)
          window.clearTimeout($timer)
          $timer = window.setTimeout(function(){_search($self.val())},100)
        })
    })
    function _search(query) {
      if (query == "") {
        $("[data-"+dataAttr+"]").show()
        $('.searchStatus').hide()
        return false
      }
      var input = _filterQuery(query, $common)
      var results = 0
      $("[data-"+dataAttr+"]").each(function(){
        var tags = $(this).attr('data-'+dataAttr).replace('-',' ').replace(/[^a-zA-Z ]/g, "").split(' ')
        var match = false
          for (var i = 0; i < input.length; i++) {
            var reg = _makeRegExp(input[i])
            for (var t = 0; t < tags.length; t++) {
              if(reg.test(tags[t])) {
                match = true
              }
            }
          }
          if (match == true) {
            $(this).show()
            results ++
          }
          else {
            $(this).hide()
          }
      })
      $('.resultCount').text(results)
      $('.searchStatus').show()
    }
    function _submitButton(box) {
      var $submitButton = $('<button class="dataSearchButton">Search</button>')
      $submitButton.click(function(){
        _search(box.val())
      })
      return $submitButton
    }
    function _clearButton(box) {
      var $clearButton = $('<button class="dataClearButton">Clear Search</button>')
      $clearButton.click(function(){
        box.val('')
        $("[data-"+dataAttr+"]").show()
        $('.searchStatus').hide()
      })
      return $clearButton
    }
    function _filterQuery(sentence, common) {
        var wordArr = sentence.match(/\w+/g),
            commonObj = {},
            uncommonArr = [],
            word, i
        
        common = common.split(',')
        for ( i = 0; i < common.length; i++ ) {
            commonObj[ common[i].trim() ] = true
        }
        
        for ( i = 0; i < wordArr.length; i++ ) {
            word = wordArr[i].trim().toLowerCase()
            if ( !commonObj[word] ) {
                uncommonArr.push(word)
            }
        }
        return uncommonArr
    }
    function _makeRegExp(phrase) {
        return new RegExp("\\b"+ phrase.replace(/\\/g, "\\\\"), "gi")
    }
    return this
  }
})(jQuery);