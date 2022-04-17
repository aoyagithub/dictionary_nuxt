<template>
  <div v-if="result.id && !error" class="content inner">
    <div class="heading">
      <h1 class="title">{{ title }}</h1>
      <span class="pronunciation" v-if="pronunciation">{{
        pronunciation
      }}</span>
    </div>
    <section id="meaning">
      <section
        v-for="(lexicalEntry, key) in lexicalEntries"
        class="lexical-entries"
        :key="key"
      >
        <div class="lexical-heading-wrap">
          <h2 class="h2 lexical-heading">
            {{ lexicalEntry.lexicalCategory.id }}
          </h2>
          <div
            v-if="lexicalEntry.entries[0].notes"
            class="lexical-heading lexical-heading-type2"
          >
            [{{ lexicalEntry.entries[0].notes[0].text }}]
          </div>
          <div
            class="lexical-heading lexical-heading-type1"
            v-if="lexicalEntry.entries[0].inflections"
          >
            <div
              class="lexical-heading-type1-bracket"
              v-for="(inflection, key) in lexicalEntry.entries[0].inflections"
              :key="key"
            >
              <span v-if="grammaticalFeatures">{{ grammaticalFeatures }}</span>
              <span class="bold"> {{ inflection.inflectedForm }} </span>
              <span
                class="inflection-pronunciations"
                v-if="inflection.pronunciations"
              >
                {{
                  inflection.pronunciations[
                    inflection.pronunciations.length - 1
                  ].phoneticSpelling
                }}
              </span>
            </div>
          </div>
        </div>

        <ol class="ol" v-if="lexicalEntry.entries[0].senses">
          <li
            class="li"
            v-for="(sense, key) in lexicalEntry.entries[0].senses"
            :key="key"
          >
            <p class="ol-li-wrap">
              <span class="sense-notes" v-if="sense.notes"
                >[{{ sense.notes[0].text }}]</span
              >
              <span class="bold sense-definitions" v-if="sense.definitions">{{
                sense.definitions[0]
              }}</span>
              <template v-if="sense.examples">
                <span
                  class="chunk example"
                  v-for="(example, key) in sense.examples"
                  :key="key"
                >
                  <span
                    v-if="example.notes"
                    ref="exampleNotesText"
                    class="example-notes-text bold"
                    >{{ example.notes[0].text }}</span
                  >
                  <span class="italic example-text">{{ example.text }}</span>
                </span>
              </template>
            </p>
            <ul class="ul" v-if="sense.subsenses">
              <li
                class="li"
                v-for="(subsense, key) in sense.subsenses"
                :key="key"
              >
                <span v-if="subsense.constructions" class="bold"
                  >({{ subsense.constructions[0].text }})</span
                >
                <span
                  v-if="subsense.definitions"
                  class="bold subsense-definitions"
                  >{{ subsense.definitions[0] }}</span
                >
                <span
                  v-if="subsense.examples"
                  ref="subsenseExamples"
                  class="italic"
                >
                  <span
                    class="example"
                    v-for="(example, key) in subsense.examples"
                    :key="key"
                  >
                    <span v-if="example.notes"
                      >[{{ example.notes[0].text }}]</span
                    >
                    <span>{{ example.text }}</span>
                  </span>
                </span>
              </li>
            </ul>
          </li>
        </ol>
      </section>
    </section>

    <section id="phrases" class="section" v-if="phrases">
      <h3 class="h3">PHRASES</h3>
      <ul class="ul">
        <li
          class="li"
          v-for="(phrase, key) in lexicalEntries[0].phrases"
          :key="key"
          @click="clickWord"
        >
          <span class="li-text clickable">{{ phrase.text }}</span>
        </li>
      </ul>
    </section>

    <section id="phrasalVerbs" class="section" v-if="phrasalVerbs">
      <h3 class="h3">PHRASAL VERBS</h3>
      <ul class="ul">
        <li
          class="li"
          v-for="(phrhasalVerb, key) in lexicalEntries[0].phrasalVerbs"
          :key="key"
          @click="clickWord"
        >
          <span class="li-text clickable">{{ phrhasalVerb.text }}</span>
        </li>
      </ul>
    </section>

    <section id="origin" class="section" v-if="origin">
      <h3 class="h3">ORIGIN</h3>
      <p class="origin-text">
        {{ lexicalEntries[0].entries[0].etymologies[0] }}
      </p>
    </section>
  </div>
  <div v-else-if="error" class="content inner error">
    <p class="content-text">No entries found.</p>
  </div>
  <div v-else class="content inner">
    <p class="content-text">
      Type a word to look up in <br />New Oxford American Dictionary
    </p>
  </div>
</template>

<script>
export default {
  props: ["result"],
  data() {
    return {
      title: "",
      pronunciation: "",
      lexicalEntries: [],
      grammaticalFeatures: "",
      phrases: false,
      phrasalVerbs: false,
      origin: false,
      error: false,
    };
  },
  methods: {
    clickWord(e) {
      this.$emit("search", e.target.innerText);
    },
  },
  updated() {
    this.result.name === "Error" ? (this.error = true) : (this.error = false);
    if (this.result.word) {
      this.title = this.result.word;
      const pronunciations =
        this.result.results[0].lexicalEntries[0].entries[0].pronunciations;
      let pronunciation = "";
      if (pronunciations) {
        pronunciations.map((c, i) => {
          if (i === 1) {
            pronunciation = c.phoneticSpelling;
          } else if (i % 2 !== 0) {
            pronunciation += `, ${c.phoneticSpelling}`;
          }
        });
      }
      this.pronunciation = pronunciation;
      const lexicalEntries = this.result.results[0].lexicalEntries;
      this.lexicalEntries = lexicalEntries;
      let grammaticalFeatures = "";
      const grammaticalFeaturesArray = [];
      if (lexicalEntries) {
        lexicalEntries.map((c, i) => {
          if (c.lexicalCategory.id === "verb") {
            if (c.entries && c.entries[0].inflections) {
              if (
                c.entries &&
                c.entries[0].inflections[0].grammaticalFeatures
              ) {
                c.entries[0].inflections[0].grammaticalFeatures.map((c, i) => {
                  grammaticalFeaturesArray.push(c.text.toLowerCase());
                });
              }
            }
          }
        });
      }
      grammaticalFeaturesArray.reverse().map((c, i) => {
        if (i === 0) {
          grammaticalFeatures = c;
        } else {
          grammaticalFeatures += ` and ${c}`;
        }
      });
      this.grammaticalFeatures = grammaticalFeatures;

      if (this.$refs.exampleNotesText) {
        this.$refs.exampleNotesText.map((c, i) => {
          if (c.innerText.indexOf("(") !== -1) {
            return;
          } else if (c.innerText.indexOf('"') !== -1) {
            let c_innerText = c.innerText;
            while (c_innerText.indexOf('"') !== -1) {
              c_innerText = c_innerText.replace('"', "");
            }
            c.innerText = `(${c_innerText})`;
          } else {
            c.innerText = `(${c.innerText})`;
          }
        });
      }
      //   if (this.$refs.subsenseExamples) {
      //     this.$refs.subsenseExamples.map((c, i) => {
      //       if (
      //         c.innerText.indexOf("?") !== -1 ||
      //         c.innerText.indexOf("!") !== -1
      //       ) {
      //         return;
      //       } else {
      //         c.innerText = `${c.innerText}.`;
      //       }
      //     });
      //   }
      lexicalEntries[0].phrases
        ? (this.phrases = true)
        : (this.phrases = false);
      lexicalEntries[0].phrasalVerbs
        ? (this.phrasalVerbs = true)
        : (this.phrasalVerbs = false);
      lexicalEntries[0].entries[0].etymologies
        ? (this.origin = true)
        : (this.origin = false);
    }
  },
};
</script>

<style lang="scss">
$gray: #8a8a8a;
.inline {
  display: inline;
}
.example + .example:before {
  content: " | ";
  font-style: normal;
}
.section {
  margin-top: 40px;
  .h3 {
    border-bottom: 1px solid #ccc;
    padding-bottom: 6px;
    margin-bottom: 10px;
    font-size: 23px;
  }
  .ul {
    .li {
      font-size: 20px;
      font-weight: bold;
      padding-left: 1em;
      padding-right: 1em;
      .li-text {
        line-height: 2;
      }
    }
  }
  .origin-text {
    padding-left: 1em;
    padding-right: 1em;
  }
}
.content {
  font-size: 20px;
}
.content.inner {
  height: 100%;
  padding-top: 26px;
  padding-bottom: 26px;
}
.content-text {
  color: #808080;
  text-align: center;
  font-size: 30px;
  line-height: 2.5;
  padding-top: 1.5em;
}
.heading {
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  margin-bottom: 20px;
}
.title {
  font-size: 36px;
}
.pronunciation {
  font-size: 20px;
  line-height: 1;
  font-family: "Arial";
  color: $gray;
  padding-right: 0.5em;
  padding-left: 0.5em;
  margin-left: 1em;
  border-right: 2px solid $gray;
  border-left: 2px solid $gray;
}
.lexical-heading {
  font-size: 26px;
  margin-bottom: 10px;
  &-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    flex-wrap: wrap;
  }
  &-type1 {
    font-size: 24px;
    margin-left: 0.25em;
    &-bracket {
      &::before {
        content: "(";
      }
      &::after {
        content: ")";
      }
    }
  }
  &-type2 {
    font-style: italic;
    color: $gray;
    font-size: 24px;
    margin-left: 0.25em;
  }
}
.inflection-pronunciations {
  font-size: 20px;
  line-height: 1;
  font-family: "Arial";
  color: $gray;
  padding-right: 0.25em;
  padding-left: 0.25em;
  margin-right: 0.25em;
  border-right: 2px solid $gray;
  border-left: 2px solid $gray;
}
.ol > .li {
  list-style-type: none;
  padding-left: 1em;
  margin-left: 1em;
  counter-increment: cnt;
  position: relative;
  &::before {
    content: counter(cnt);
    position: absolute;
    left: 0;
    color: $gray;
    font-weight: bold;
  }
  .ul > .li {
    padding-left: 1em;
    position: relative;
    &::before {
      position: absolute;
      left: 0;
      content: "•";
      color: $gray;
      font-weight: bold;
    }
  }
}
.sense-notes {
  color: $gray;
  font-style: italic;
}
.sense-definitions::after,
.subsense-definitions::after {
  content: ": ";
}
#meaning > .lexical-entries + .lexical-entries {
  margin-top: 20px;
}
@media (max-width: 768px) {
  .content-text {
    font-size: 26px;
    line-height: 1.5;
    padding-top: 0.5em;
  }
  .content.inner {
    padding-top: 10px;
    font-size: 20px;
  }
  .title {
    font-size: 30px;
  }
  .heading {
    margin-bottom: 10px;
  }
  .lexical-heading {
    font-size: 22px;
  }
  #meaning > .lexical-entries + .lexical-entries {
    margin-top: 16px;
  }
  .section {
    margin-top: 24px;
    .h3 {
      font-size: 21px;
    }
  }
}
</style>
