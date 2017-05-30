function stenoAnimation() {
  /* Phrases to type
   * [toType: string, rawSteno: string, replacesLastWord: boolean]
   **/
  var phrases =
    [ [ ['Welcome', 'HR-BG']
      , [' to', 'TO']
      , [' open', 'OEP']
      , [' Open Steno', 'STOEUPB', true]
      , ['.', 'TP-PL']
      ]
    , [ ['This is', 'TH-S']
      , [' what', 'WHA']
      , [' using', 'AOUFG']
      , [' steno', 'STOEUPB']
      , [' looks', 'HRAOBGS']
      , [' like', 'HRAOEUBG']
      , ['.', 'TP-PL']
      ]
    , [ ['With', 'W']
      , [' it', 'T-']
      , [' you can', 'UBG']
      , [' write', 'WREU']
      , [' over', 'OEFR']
      , [' two', 'TWO']
      , [' hundred', 'HUPBD']
      , [' words', 'WORDZ']
      , [' a', 'AEU']
      , [' minute', 'PHEUPB']
      , ['!', 'SKHRAPL']
      ]
    , [ ['Our', 'OUR']
      , [' mission', 'PHEUGS']
      , [':', 'KHR-PB']
      ]
    , [ ['Bring', 'PWREUPBG']
      , ['ing', '-G']
      , [' snog', 'STPHOG']
      , [' stenography', 'TPEU', true]
      , [' to', 'TO']
      , [' everyone', 'EFRPB']
      , ['.', 'TP-PL']
      ]
    ]

  // Grab typer and wait for a little.
  var typer = window.typer('#stenoer', 1)
  typer.empty().line('').pause(2000)

  /* Draw an outline (raw steno) on the HTML steno board */
  function highlightOutline(outline) {
    // Parsing from  'STROEBG' to 'S- T- R- O E -B -G'
    var matches = /([^\*AOEU\-]*)([AOEU\-\*]*)([^\*AOEU\-]*)/g.exec(outline)
    var left = matches[1] || ''
    var center = matches[2] || ''
    var right = matches[3] || ''
    var chord = []
    var i = 0

    for (i; i < left.length; i++) {
      chord.push(left[i] + '-')
    }
    for (i = 0; i < center.length; i++) {
      if (center[i] === '*') {
        chord.push('asterisk')
      } if (center[i] !== '-') {
        chord.push(center[i])
      }
    }
    for (i = 0; i < right.length; i++) {
      chord.push('-' + right[i])
    }

    // Find all the keys in the DOM
    var stenoKeys = document.getElementsByClassName('steno-key')
    
    i = 0
    var keyElement
    for (i; i < stenoKeys.length; i++) {
      keyElement = stenoKeys[i]
      if (chord.indexOf(keyElement.id) > -1) {
        // If the key is in the chord, activate it.
        keyElement.className += ' active'
      } else if (keyElement.className.indexOf('active') > -1) {
        // Otherwise deactivate it.
        var offset = keyElement.className.indexOf('active')
        keyElement.className =
          keyElement.className.substring(0, offset)
      }
    }
  }

  /* Write a phrase chord-by-chord with typer */
  function writePhrase(phrase) {
    var i = 0
    var word, stroke, replace, last_word, prefix, limit, to_backspace, to_write

    for (i; i < phrase.length; i++) {
      word = phrase[i][0]
      stroke = phrase[i][1]
      replace = !!phrase[i][2]

      if (replace) {
        prefix = 0
        limit = Math.min(last_word.length, word.length)
        for (prefix; prefix < limit; prefix++) {
          if (last_word[prefix] !== word[prefix]) {
            break
          }
        }
        to_backspace = last_word.length - prefix
        to_write = word.slice(prefix)
      } else {
        to_backspace = 0
        to_write = word
      }
      function sendStroke(stroke) {
        return function() {
          highlightOutline(stroke)
        }
      }

      typer
        .pause(50)
        .run(sendStroke(stroke))
        .pause(150)
        .run(function() { highlightOutline('') })
      if (to_backspace) {
        typer.back(to_backspace)
      }
      typer.continue([to_write], 1)
      last_word = word
    }
  }

  /* Undo a phrase chord-by-chord with typer */
  function asteriskPhrase(phrase) {
    var i = 0
    var word, stroke, replace, last_word, prefix, limit, to_backspace, to_write

    for (i = phrase.length - 1; i >= 0; i--) {
      word = phrase[i][0]
      stroke = phrase[i][1]
      replace = !!phrase[i][2]

      if (replace) {
        prefix = 0
        last_word = phrase[i - 1][0]
        limit = Math.min(last_word.length, word.length)
        for (prefix; prefix < limit; prefix++) {
          if (last_word[prefix] !== word[prefix]) {
            break
          }
        }
        to_backspace = word.length - prefix
        to_write = last_word.slice(prefix)
      } else {
        to_backspace = word.length
        to_write = ''
      }

      typer
        .pause(25)
        .run(function() { highlightOutline('*') })
        .pause(75)
        .run(function() { highlightOutline('') })
      if (to_backspace) {
        typer.back(to_backspace)
      }
      typer.continue([to_write], 1)
    }
  }

  function writeAndAsterisk(phrase) {
    writePhrase(phrase)
    typer.pause(1500)
    asteriskPhrase(phrase)
    typer.pause(250)
  }

  function removeDoneClass(element) {
    var classes = element.className.split(' ')
    var newClass = ''
    var i = 0
    var currentClass
    for (i; i < classes.length; i++) {
      currentClass = classes[i]
      if (currentClass !== 'done' && currentClass) {
        newClass += currentClass + ' '
      }
    }
    element.className = newClass
  }

  function addDoneClass(element) {
    var classes = element.className.split(' ')
    var newClass = ''
    var i = 0
    var currentClass
    var hasDone
    for (i; i < classes.length; i++) {
      currentClass = classes[i]
      if (currentClass === 'done') {
        hasDone = true
      }
      if (currentClass) {
        newClass += currentClass + ' '
      }
    }
    if (!hasDone) {
      newClass += 'done'
    }
    element.className = newClass
  }

  function longAnimation() {
    var animatedHeader = document.getElementById('stenoer')
    if (animatedHeader.className.indexOf('done') === -1) {
      return // Prevent double clicks.
    }
    removeDoneClass(animatedHeader)
    setTimeout(function() {
      while (animatedHeader.hasChildNodes()) {
        animatedHeader.removeChild(animatedHeader.lastChild);
      }
      animatedHeader.removeAttribute('data-typer')
      
      typer = window.typer('#stenoer', 1)
      typer.empty()
      typer.line()
      typer.pause(1000)
      var i = 0
      for (i; i < phrases.length; i++) {
        if (i === phrases.length - 1) {
          writePhrase(phrases[i])
        } else {
          writeAndAsterisk(phrases[i])
        }
      }
      typer.end(addDoneClass)
    }, 250)
  }

  function shortAnimation() {
    typer.run(removeDoneClass)
    writePhrase(phrases[phrases.length - 1])
    typer.end(addDoneClass)
  }
  document.getElementById("replayButton").addEventListener("click", longAnimation);
  shortAnimation()
}
if (window.typer) {
  stenoAnimation()
} else {
  console.warn('Typing animation disabled because typer.js was not loaded.')
}