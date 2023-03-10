
#include <stdlib.h>
#include <string>
#include <locale>
#include <codecvt>
#include <iostream>
#include <emscripten/bind.h>
#include <emscripten.h>

#include <pinyinime.h>


using namespace std;
using namespace ime_pinyin;
using namespace emscripten;


#define DICT_PATH "./dict/dict_pinyin.dat"
#define USER_DICT_PATH "./user/dict_pinyin.dat"
#define CAND_BUFFER_MAX_LEN 40 // Maximum for the sentence char length
#define SPS_MAX_LEN 120 // Maximum for spelling string.
#define CANDS_MAX_NUM 50 // Maximum for the candidates.


static const size_t kMaxPredictNum = 20;
static char16 (*pre_buf)[kMaxPredictSize + 1] = NULL;

class Decoder {
  public:
    Decoder() {
      is_working = im_open_decoder(DICT_PATH, USER_DICT_PATH);
      im_set_max_lens(SPS_MAX_LEN, CAND_BUFFER_MAX_LEN);
    };
    ~Decoder() {
      im_cancel_input();
      im_close_decoder();
    };

    bool is_working = false;

    /**
     * Gets the candidates for the spelling string or chosen candidate.
     * 
     * @param sps_buf Spelling string.
     * @param cand_id The chosen candidate id.
     * @return 
     */
     string decode(string sps_buf, short int cand_id) {
      size_t cand_num;

      if (cand_id == -1) {
        size_t sps_len = sps_buf.size();
        // cout << "sps_buf" << sps_buf << endl;
        cand_num = im_search(sps_buf.c_str(), sps_len);
      } else {
        // Get the segmentation infomation.
        cand_num = im_choose(cand_id);
      }

      // string candidates[CANDS_MAX_NUM];
      string candidates[cand_num];
      short int len = getCandidates(cand_num, candidates);
      // cout << "len:" << len << endl;
      for(short int i = 1; i < len; i++ ) {
        // cout << "i:" << i << "-" << candidates[i] << endl;
        candidates[0].append("|" + candidates[i]);
      }

      return *candidates;
    };

    /** Clear the decoder. */
    bool clear() {
      im_flush_cache();
      return im_cancel_input();
    }

    size_t search(string sps_buf) {
      return im_search(sps_buf.c_str(), sps_buf.size());
    }

    size_t del_search(size_t pos, bool is_pos_in_splid, bool clear_fixed_this_step) {
      return im_delsearch(pos, is_pos_in_splid, clear_fixed_this_step);
    }

    void reset_search() {
      im_reset_search();
    }

    /** Not support. */
    // size_t add_letter(char ch) {
    //   // char ch = str[0];
    //   // cout << "ch:" << ch << endl;
    //   return im_add_letter(ch);
    // }

    size_t decoded_len;

    string get_sps_str() {
      string spsStr = im_get_sps_str(&decoded_len);
      return spsStr;
    }

    string get_candidate(size_t cand_id) {
      char16 cand_str[CAND_BUFFER_MAX_LEN];
      
      im_get_candidate(cand_id, cand_str, CAND_BUFFER_MAX_LEN);
      
      std::wstring_convert<std::codecvt_utf8_utf16<char16_t>, char16_t> conv;
      return conv.to_bytes((char16_t *)cand_str);
    }

    string get_predicts(u16string history) {
      const char16_t* history_cstr = history.c_str();
      short int cand_num = im_get_predicts((const char16*)history_cstr, pre_buf);
      delete[] history_cstr;
      // delete[] pre_buf;
      // return cand_num;
      
      if (cand_num > kMaxPredictNum) {
        cand_num = kMaxPredictNum;
      }

      string candidates;
      int currentNum = 0;
      for(short int i = 0; i <= cand_num; i++) {
        char16* cand_str = pre_buf[i];
        
        wstring_convert<codecvt_utf8_utf16<char16_t>, char16_t> conv;
        string u8str = conv.to_bytes((char16_t *)cand_str);
        candidates.append(u8str + "|");
        delete[] cand_str;
      }

      return candidates;
    }

    size_t get_spl_start_pos() {
      EM_ASM({globalThis.splStart = []});
      const unsigned short *spl_start;
      size_t len = im_get_spl_start_pos(spl_start);
      for (size_t i = 0; i <= len; i++) {
        EM_ASM({ globalThis.splStart.push($0); }, spl_start[i]);
      }
      
      return len;
    }

    size_t choose(size_t cand_id) {
      return im_choose(cand_id);
    }

    size_t cancel_last_choice() {
      return im_cancel_last_choice();
    }

    size_t get_fixed_len() {
      return im_get_fixed_len();
    }

    bool cancel_input() {
      return im_cancel_input();
    }

    void close() {
      im_close_decoder();
    }

    private:
      size_t getCandidates(size_t cand_num, string *cands_list)
      {
        char16 cand_str[CAND_BUFFER_MAX_LEN];
        if (cand_num > CANDS_MAX_NUM) {
          cand_num = CANDS_MAX_NUM;
        }

        for(size_t i = 0; i < cand_num; i++)
        {
          im_get_candidate(i, cand_str, CAND_BUFFER_MAX_LEN);
          
          // TODO May be error!
          std::wstring_convert<std::codecvt_utf8_utf16<char16_t>, char16_t> conv;
          
          string u8str = conv.to_bytes((char16_t *)cand_str);
          // cout << "u8str:" << u8str << endl;
          cands_list[i] = u8str;
        }

        return cand_num;
      }

};

EMSCRIPTEN_BINDINGS(pinyin_decoder) {
  class_<Decoder>("Decoder")
    .constructor()
    .function("decode", &Decoder::decode)
    .function("clear", &Decoder::clear)
    .function("search", &Decoder::search)
    .function("delSearch", &Decoder::del_search)
    .function("resetSearch", &Decoder::reset_search)
    .function("getSpsStr", &Decoder::get_sps_str)
    .function("getCandidate", &Decoder::get_candidate)
    .function("getSplStartPos", &Decoder::get_spl_start_pos)
    .function("choose", &Decoder::choose)
    .function("cancelLastChoice", &Decoder::cancel_last_choice)
    .function("getFixedLen", &Decoder::get_fixed_len)
    .function("cancelInput", &Decoder::cancel_input)
    .function("getPredicts", &Decoder::get_predicts)
    .function("close", &Decoder::close)
    .property("isWorking", &Decoder::is_working)
    .property("decodedLen", &Decoder::decoded_len)
    ;
}