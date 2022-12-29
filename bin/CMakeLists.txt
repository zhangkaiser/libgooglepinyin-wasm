cmake_minimum_required(VERSION 3.10)

project(GooglePinyin)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

set(PUBLIC_HEADERS 
    ../googlepinyin/dictbuilder.h
    ../googlepinyin/dictdef.h
    ../googlepinyin/dictlist.h
    ../googlepinyin/dicttrie.h
    ../googlepinyin/lpicache.h
    ../googlepinyin/matrixsearch.h
    ../googlepinyin/mystdlib.h
    ../googlepinyin/ngram.h
    ../googlepinyin/searchutility.h
    ../googlepinyin/spellingtable.h
    ../googlepinyin/spellingtrie.h
    ../googlepinyin/splparser.h
    ../googlepinyin/sync.h
    ../googlepinyin/userdict.h
    ../googlepinyin/utf16char.h
    ../googlepinyin/utf16reader.h
)

set(PINYIN_SOURCES
    ../googlepinyin/dictbuilder.cpp
    ../googlepinyin/dictlist.cpp
    ../googlepinyin/dicttrie.cpp
    ../googlepinyin/lpicache.cpp
    ../googlepinyin/matrixsearch.cpp
    ../googlepinyin/mystdlib.cpp
    ../googlepinyin/ngram.cpp
    ../googlepinyin/searchutility.cpp
    ../googlepinyin/spellingtable.cpp
    ../googlepinyin/spellingtrie.cpp
    ../googlepinyin/splparser.cpp
    ../googlepinyin/sync.cpp
    ../googlepinyin/userdict.cpp
    ../googlepinyin/utf16char.cpp
    ../googlepinyin/utf16reader.cpp
)

set(EXECUTABLE_NAME builder)

add_executable(${EXECUTABLE_NAME} ${PINYIN_SOURCES} ./pinyin_dictbuilder.cpp ${PUBLIC_HEADERS})

