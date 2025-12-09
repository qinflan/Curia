import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { useState, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import { searchBillsByKeywords } from "@/api/billsHandler"
import { Bill } from "./types/BillWidgetTypes"

type SearchBarProps = {
    onSearch?: (results: Bill[], keyword: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [keywords, setKeywords] = useState<string>("");
    const inputRef = useRef<TextInput>(null);

    const handleSearchBills = async () => {
        try {
            const response = await searchBillsByKeywords(keywords)
            onSearch?.(response.data, keywords)
        } catch (err) {
            console.error("bill search error: ", err)
        }
    }

    const handleClearSearch = async () => {
        if (keywords.length > 0) {
            setKeywords("")
            inputRef.current?.blur();
            onSearch?.([], "");
        }
    }

    return (
        <View style={styles.searchBarContainer}>
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearchBills}>
                <Ionicons 
                    name="search"
                    size={16} 
                    color="black"
                />
            </TouchableOpacity>
            <TextInput
                style={styles.textInput}
                onChangeText={setKeywords}
                value={keywords}
                placeholder="search bills"
                placeholderTextColor={"#747474ff"}
                onSubmitEditing={handleSearchBills}
            />
            { keywords.length > 0 && (
                <TouchableOpacity style={styles.searchBtn} onPress={handleClearSearch}>
                    <Ionicons 
                        name="close"
                        size={18} 
                        color="black"
                    />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flex: 1,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        width: "100%",
        paddingHorizontal: 6,
        marginBottom: 30,
    },
    textInput: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        fontFamily: 'InterRegular',
        letterSpacing: -0.2,
        fontSize: 15
    },
    searchBtn: {
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginLeft: "auto"
    }
})

export default SearchBar